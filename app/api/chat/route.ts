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

    let currentSessionId = incomingSessionId;
    let isNewSession = false;

    // Create a new OpenAI thread if no sessionId (threadId) is provided
    if (!currentSessionId) {
      const newThread = await createThread();
      currentSessionId = newThread.id;
      isNewSession = true;
      // Create corresponding session in our DB - Assumes create generates its own ID
      const newDbSession = SessionRepository.create(userId || undefined);
      console.log(`Created new OpenAI thread ${currentSessionId} and DB session ${newDbSession.id}`);
    } else {
      // Update existing session activity in our DB
      SessionRepository.updateActivity(currentSessionId);
      console.log(`Using existing thread/session: ${currentSessionId}`);
    }

    // Record the user message in our DB (optional, as OpenAI keeps history)
    // Could be useful for logging or if OpenAI history is purged
    const userDbMessage = MessageRepository.create({
      user_id: userId || null,
      content: message,
      role: 'user',
      session_id: currentSessionId
    });

    // Record telemetry
    TelemetryRepository.recordEvent('message_sent', null, userId, currentSessionId);

    // 1. Add the user message to the OpenAI Thread
    await addMessageToThread(currentSessionId, {
      role: 'user',
      content: message
    });
    console.log(`Added message to thread ${currentSessionId}`);

    // 2. Run the Assistant on the Thread
    console.log(`Running assistant ${assistantId} on thread ${currentSessionId}...`);
    const run = await runAssistantOnThread(currentSessionId, assistantId);
    // Note: runAssistantOnThread already waits for completion
    console.log(`Run ${run.id} completed with status: ${run.status}`);

    // 3. Retrieve the latest message from the Thread (should be the assistant's response)
    const threadMessages = await getMessagesFromThread(currentSessionId, 1, 'desc');
    
    let assistantResponseContent = "Sorry, I couldn't process that."; // Default response
    let assistantMessageId: string | null = null;

    if (threadMessages.length > 0 && threadMessages[0].role === 'assistant') {
      const assistantMessage = threadMessages[0];
      assistantMessageId = assistantMessage.id;
      // The getMessagesFromThread function already processes annotations.
      // We need to extract the text content.
      const textContent = assistantMessage.content
        .filter(contentBlock => contentBlock.type === 'text')
        .map(textContentBlock => (textContentBlock as any).text.value) // Type assertion might be needed depending on exact type
        .join('\n');
      
      if (textContent) {
        assistantResponseContent = textContent;
      }
    } else {
      console.warn(`No assistant message found or latest message not from assistant in thread ${currentSessionId}`);
      // Handle cases where the assistant might not have responded as expected
    }

    // Record the assistant's response in our DB (optional)
    const assistantDbMessage = MessageRepository.create({
      user_id: null, 
      content: assistantResponseContent,
      role: 'assistant',
      session_id: currentSessionId,
      // Optionally store the OpenAI message ID for correlation
      // metadata: { openai_message_id: assistantMessageId }
    });

    // Return the necessary info to the client
    return NextResponse.json({
      sessionId: currentSessionId, // Return the threadId as sessionId
      message: assistantDbMessage, // Return the DB representation of the message
      // Or return the raw content: 
      // responseContent: assistantResponseContent,
      success: true
    });

  } catch (error: any) {
    console.error('Chat API POST error:', error);
    // Provide a more specific error message if possible
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
