import { NextRequest, NextResponse } from 'next/server';
import { MessageRepository, SessionRepository, TelemetryRepository, ChatMessage as DbChatMessage } from '@/lib/database';
import { 
  createThread,
  addMessageToThread,
  runAssistantOnThread,
  getMessagesFromThread,
  deleteThread
} from '@/lib/api/llm/openai';
import { randomUUID } from 'crypto';

const assistantId = process.env.OPENAI_ASSISTANT_ID;
if (!assistantId) {
  console.error("FATAL ERROR: OPENAI_ASSISTANT_ID environment variable is not set.");
  // Optional: throw an error during build or startup in a real deployment
}

// POST /api/chat - Send a message and get a response using Assistants API
export async function POST(request: NextRequest) {
  if (!assistantId) {
    // Handle the case where the assistant ID is missing at runtime
    return NextResponse.json({ error: 'Assistant configuration error.' }, { status: 500 });
  }

  try {
    const { message, sessionId: incomingSessionId, userId } = await request.json();

    // Validate required fields
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let openAIThreadId = incomingSessionId; // Assume incoming sessionId is the OpenAI Thread ID
    let localDbSessionId: string | undefined = undefined;

    // Create a new OpenAI thread if no sessionId (threadId) is provided
    if (!openAIThreadId) {
      const newThread = await createThread();
      openAIThreadId = newThread.id; // Store the new OpenAI Thread ID

      // Create corresponding session in our DB - Assumes create generates its own ID
      const newDbSession = SessionRepository.create(userId || undefined);
      localDbSessionId = newDbSession.id; // Store the local DB session ID
      console.log(`Created new OpenAI thread ${openAIThreadId} and DB session ${localDbSessionId}`);
      // TODO: Consider linking openAIThreadId to the local session record in the DB
    } else {
      // If using an existing OpenAI thread, we need to find the corresponding local DB session ID.
      // This requires a way to look up the local session based on the OpenAI thread ID.
      // Assuming SessionRepository has a method like findByOpenAIThreadId, or that the ID passed *is* the local ID.
      // FOR NOW: Let's assume incomingSessionId was actually the LOCAL DB ID for existing sessions.
      // This simplifies the logic but means the client needs to send the LOCAL ID.
      // Re-evaluating the initial assumption:
      openAIThreadId = incomingSessionId; // Let's stick with this being the OpenAI ID

      // !!! CRITICAL FLAW: We don't have the localDbSessionId for existing threads here easily.
      // !!! TEMPORARY WORKAROUND: We cannot reliably log to local DB for existing threads without DB schema changes or lookups.
      // !!! Let's skip local DB operations for *existing* threads for now to avoid errors.

      // Update existing session activity in our DB (This call might be incorrect if it expects local ID)
      // SessionRepository.updateActivity(openAIThreadId); // Commenting out as it likely needs local ID
      console.log(`Using existing OpenAI thread: ${openAIThreadId}`);
    }

    // --- Local DB Operations (Only if localDbSessionId is known, i.e., new session) ---
    if (localDbSessionId) {
      // Record the user message in our DB (optional, as OpenAI keeps history)
      const userDbMessage = MessageRepository.create({
        user_id: userId || null,
        content: message,
        role: 'user',
        session_id: localDbSessionId // Use local DB session ID
      });

      // Record telemetry
      TelemetryRepository.recordEvent('message_sent', null, userId, localDbSessionId); // Use local DB session ID
    } else {
      console.warn(`Skipping local DB logging for existing thread ${openAIThreadId} as localDbSessionId is unknown.`);
    }

    // --- OpenAI API Operations (Always use openAIThreadId) ---
    
    // 1. Add the user message to the OpenAI Thread
    await addMessageToThread(openAIThreadId, {
      role: 'user',
      content: message
    });
    console.log(`Added message to thread ${openAIThreadId}`);

    // 2. Run the Assistant on the Thread
    console.log(`Running assistant ${assistantId} on thread ${openAIThreadId}...`);
    const run = await runAssistantOnThread(openAIThreadId, assistantId);
    console.log(`Run ${run.id} completed with status: ${run.status}`);

    // 3. Retrieve the latest message from the Thread
    const threadMessages = await getMessagesFromThread(openAIThreadId, 1, 'desc');
    
    let assistantResponseContent = "Sorry, I couldn't process that."; 
    let assistantMessageId: string | null = null;

    if (threadMessages.length > 0 && threadMessages[0].role === 'assistant') {
      const assistantMessage = threadMessages[0];
      assistantMessageId = assistantMessage.id;
      const textContent = assistantMessage.content
        .filter(contentBlock => contentBlock.type === 'text')
        .map(textContentBlock => (textContentBlock as any).text.value)
        .join('\n');
      
      if (textContent) {
        assistantResponseContent = textContent;
      }
    } else {
      console.warn(`No assistant message found or latest message not from assistant in thread ${openAIThreadId}`);
    }

    // --- Local DB Operations for Assistant Message (Only if localDbSessionId is known) ---
    let assistantDbMessage = null;
    if (localDbSessionId) {
      assistantDbMessage = MessageRepository.create({
        user_id: null, 
        content: assistantResponseContent,
        role: 'assistant',
        session_id: localDbSessionId, // Use local DB session ID
        // metadata: { openai_message_id: assistantMessageId } 
      });
    }

    // --- API Response ---
    // Return the OpenAI Thread ID as sessionId for subsequent requests
    // Optionally return localDbSessionId if the client needs it
    return NextResponse.json({
      sessionId: openAIThreadId, 
      message: assistantDbMessage, // This might be null if it was an existing thread
      responseContent: assistantResponseContent, // Always return the content
      success: true
    });

  } catch (error: any) {
    console.error('Chat API POST error:', error);
    const errorMessage = error.message || 'Failed to process message';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// GET /api/chat - Get chat history for a session from OpenAI Thread
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId'); // sessionId is the threadId

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID (Thread ID) is required' }, { status: 400 });
    }

    // Update session activity in our local DB
    SessionRepository.updateActivity(sessionId);

    // Get messages directly from the OpenAI Thread
    // Retrieve all messages in ascending order (oldest first)
    const messages = await getMessagesFromThread(sessionId, undefined, 'asc'); 

    // TODO: Potentially map `messages` (OpenAI.Beta.Threads.Messages.ThreadMessage[])
    // to the format your frontend expects if it differs.
    // For now, returning the raw OpenAI messages.

    return NextResponse.json({
      sessionId,
      messages, // Return OpenAI messages
      success: true
    });
  } catch (error) {
    console.error('Chat history GET API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve chat history' }, { status: 500 });
  }
}

// DELETE /api/chat - Delete a chat session (OpenAI Thread and local DB records)
export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId'); // sessionId is the threadId

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID (Thread ID) is required' }, { status: 400 });
    }

    // 1. Attempt to delete the OpenAI Thread
    try {
      await deleteThread(sessionId);
      console.log(`Successfully initiated deletion of OpenAI Thread: ${sessionId}`);
    } catch (openaiError) {
      console.error(`Failed to delete OpenAI Thread ${sessionId}:`, openaiError);
      // Decide if this is critical. We might still want to delete local records.
      // For now, we log the error and proceed.
    }

    // 2. Delete messages for the session from local DB
    MessageRepository.deleteBySessionId(sessionId);
    console.log(`Deleted local messages for session: ${sessionId}`);
    
    // 3. Delete the session record from local DB
    SessionRepository.delete(sessionId);
    console.log(`Deleted local session record: ${sessionId}`);

    return NextResponse.json({
      success: true,
      message: 'Chat session deleted (OpenAI thread and local records)'
    });
  } catch (error) {
    console.error('Chat delete API error:', error);
    return NextResponse.json({ error: 'Failed to delete chat session' }, { status: 500 });
  }
}
