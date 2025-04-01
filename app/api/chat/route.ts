import { NextRequest, NextResponse } from 'next/server';
import { MessageRepository, SessionRepository, TelemetryRepository } from '@/lib/database';
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
    const userMessage = MessageRepository.create({
      user_id: userId || null,
      content: message,
      role: 'user',
      session_id: currentSessionId
    });

    // Record telemetry for message sent
    TelemetryRepository.recordEvent('message_sent', null, userId, currentSessionId);

    // This is where you would integrate with your LLM provider
    // For now, we'll just return a simple echo response
    // TODO: Replace with actual LLM integration
    const responseText = `I received your message: "${message}". This is a placeholder response.`;
    
    // Save the assistant's response
    const assistantMessage = MessageRepository.create({
      user_id: null,
      content: responseText,
      role: 'assistant',
      session_id: currentSessionId
    });

    return NextResponse.json({
      sessionId: currentSessionId,
      message: assistantMessage,
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
