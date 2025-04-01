import { NextRequest, NextResponse } from 'next/server';
import { MessageRepository, SessionRepository, TelemetryRepository, ChatMessage as DbChatMessage } from '@/lib/database';
import { generateChatCompletion, prepareSystemMessage, ChatMessage as OpenAIChatMessage } from '@/lib/api/llm/openai';
import { randomUUID } from 'crypto';

// POST /api/chat - Send a message and get a response
export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, userId } = await request.json();

    // Validate required fields
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Create a new session if none exists
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const newSession = SessionRepository.create(userId || undefined);
      currentSessionId = newSession.id;
    } else {
      // Update session activity
      SessionRepository.updateActivity(currentSessionId);
    }

    // Record the user message
    const userDbMessage = MessageRepository.create({
      user_id: userId || null,
      content: message,
      role: 'user',
      session_id: currentSessionId
    });

    // Record telemetry for message sent
    TelemetryRepository.recordEvent('message_sent', null, userId, currentSessionId);

    // Get previous messages for context (limited to last 10 for performance)
    const previousMessages = MessageRepository.findBySessionId(currentSessionId)
      .slice(-10) // Get last 10 messages
      .map(dbMsg => ({
        role: dbMsg.role,
        content: dbMsg.content
      } as OpenAIChatMessage));
    
    // Prepare messages for OpenAI
    const systemMessage = prepareSystemMessage();
    const openaiMessages: OpenAIChatMessage[] = [
      systemMessage,
      ...previousMessages,
      { role: 'user' as const, content: message }
    ];
    
    // Generate response from OpenAI
    const aiResponse = await generateChatCompletion(openaiMessages, {
      temperature: 0.7,
      model: 'gpt-4o' // You can adjust the model as needed
    });
    
    // Save the assistant's response
    const assistantDbMessage = MessageRepository.create({
      user_id: null, // Assistant messages don't have a user_id
      content: aiResponse.content ?? '', // Default to empty string if null
      role: 'assistant',
      session_id: currentSessionId
    });

    return NextResponse.json({
      sessionId: currentSessionId,
      message: assistantDbMessage,
      success: true
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}

// GET /api/chat - Get chat history for a session
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Update session activity
    SessionRepository.updateActivity(sessionId);

    // Get messages for the session
    const messages = MessageRepository.findBySessionId(sessionId);

    return NextResponse.json({
      sessionId,
      messages,
      success: true
    });
  } catch (error) {
    console.error('Chat history API error:', error);
    return NextResponse.json({ error: 'Failed to retrieve chat history' }, { status: 500 });
  }
}

// DELETE /api/chat - Delete a chat session
export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Delete messages for the session
    MessageRepository.deleteBySessionId(sessionId);
    
    // Delete the session
    SessionRepository.delete(sessionId);

    return NextResponse.json({
      success: true,
      message: 'Chat session deleted'
    });
  } catch (error) {
    console.error('Chat delete API error:', error);
    return NextResponse.json({ error: 'Failed to delete chat session' }, { status: 500 });
  }
}
