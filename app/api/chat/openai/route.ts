import { NextRequest, NextResponse } from 'next/server';
import { MessageRepository, SessionRepository } from '@/lib/database';
import OpenAI from 'openai';
import { randomUUID } from 'crypto';

type StreamEvent = 
  | { type: 'content'; content: string; threadId: string }
  | { type: 'complete'; threadId: string }
  | { type: 'error'; content: string };

interface ChatRequest {
  message: string;
  sessionId?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = process.env.OPENAI_ASSISTANT_ID;
if (!assistantId) {
  console.error("FATAL ERROR: OPENAI_ASSISTANT_ID environment variable is not set.");
  // In production, you might want to throw an error during build or startup
}

// POST /api/chat/openai - Send a message and get a streaming response using Assistants API
export async function POST(request: NextRequest) {
  if (!assistantId) {
    return new Response(JSON.stringify({ error: 'Assistant configuration error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { message, sessionId: threadId, userId } = await request.json();

    // Validate required fields
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create or retrieve thread
    let thread;
    if (threadId) {
      try {
        thread = await openai.beta.threads.retrieve(threadId);
      } catch (e) {
        console.error(`Failed to retrieve thread: ${(e as Error).message}`);
        thread = await openai.beta.threads.create();
      }
    } else {
      thread = await openai.beta.threads.create();
    }

    // Add user message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message
    });

    // Create a streaming response
    const stream = await openai.beta.threads.runs.stream(thread.id, {
      assistant_id: assistantId,
      stream: true
    });

    // Create a transform stream to process the events
    const encoder = new TextEncoder();
    const streamResponse = new ReadableStream({
      async start(controller) {
        try {
          let accumulatedContent = '';
          let runId: string | null = null;
          let requiresAction = false;
          let toolOutputs: OpenAI.Beta.Threads.Runs.RequiredActionFunctionToolCall[] = [];

          for await (const event of stream) {
            // Handle message delta events
            if (event.event === 'thread.message.delta') {
              const delta = event.data.delta;
              if (delta.content && delta.content.length > 0) {
                for (const content of delta.content) {
                  if (content.type === 'text' && content.text) {
                    const contentValue = content.text.value || '';
                    if (contentValue) {
                      accumulatedContent += contentValue;
                      // Send the content as a JSON string with a type
                      const event: StreamEvent = {
                        type: 'content',
                        content: contentValue,
                        threadId: thread.id
                      };
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
                    }
                  }
                }
              }
            } 
            // Handle run requires action
            else if (event.event === 'thread.run.requires_action' && event.data.required_action?.submit_tool_outputs) {
              // Handle function calls if needed
              requiresAction = true;
              runId = event.data.id;
              
              // For now, just submit empty outputs since we don't support function calls in this demo
              const toolCalls = event.data.required_action.submit_tool_outputs.tool_calls;
              toolOutputs = toolCalls.map((call: OpenAI.Beta.Threads.Runs.RequiredActionFunctionToolCall) => ({
                ...call,
                output: 'This feature is not available in the demo.'
              }));
              
              // Submit the tool outputs
              if (runId && toolOutputs.length > 0) {
                await openai.beta.threads.runs.submitToolOutputs(
                  thread.id,
                  runId,
                  { 
                    tool_outputs: toolOutputs.map(toolCall => ({
                      tool_call_id: toolCall.id,
                      output: 'This feature is not available in the demo.'
                    }))
                  }
                );
              }
            }
            else if (event.event === 'thread.run.completed') {
              // Run completed, we can close the stream
              break;
            }
          }

          
          // If we have a run that requires action but we didn't handle it properly
          if (requiresAction && runId) {
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                content: 'Function calls are not fully supported in this demo.'
              })}\n\n`
            ));
          }
          
          // Send a final message with the complete content and thread ID
          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({
              type: 'complete',
              threadId: thread.id,
              content: accumulatedContent
            })}\n\n`
          ));
          
        } catch (error) {
          console.error('Stream error:', error);
          controller.enqueue(encoder.encode(
            `data: ${JSON.stringify({
              type: 'error',
              content: 'An error occurred while processing the stream.'
            })}\n\n`
          ));
        } finally {
          controller.close();
        }
      },
      cancel() {
        // Clean up if the client disconnects
        stream.controller.abort();
      }
    });

    // Return the streaming response
    return new Response(streamResponse, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    });

  } catch (error) {
    console.error('Streaming error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process message',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// GET /api/chat/openai - Get chat history for a session from OpenAI Thread
export async function GET(request: NextRequest) {
  try {
    const threadId = request.nextUrl.searchParams.get('sessionId');

    if (!threadId) {
      return NextResponse.json({ error: 'Thread ID is required' }, { status: 400 });
    }

    // Get messages from the thread
    const messages = await openai.beta.threads.messages.list(threadId, {
      order: 'asc' // Oldest first
    });

    // Transform messages to a simpler format for the frontend
    const formattedMessages = messages.data.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content
        .filter(content => content.type === 'text')
        .map(content => (content as any).text.value)
        .join('\n'),
      created_at: msg.created_at
    }));

    return NextResponse.json({
      sessionId: threadId,
      messages: formattedMessages,
      success: true
    });
  } catch (error) {
    console.error('Chat history GET API error:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve chat history',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE /api/chat/openai - Delete a chat session (OpenAI Thread)
export async function DELETE(request: NextRequest) {
  try {
    const threadId = request.nextUrl.searchParams.get('sessionId');

    if (!threadId) {
      return NextResponse.json({ error: 'Thread ID is required' }, { status: 400 });
    }

    // Delete the OpenAI thread
    await openai.beta.threads.del(threadId);
    console.log(`Successfully deleted OpenAI Thread: ${threadId}`);

    return NextResponse.json({
      success: true,
      message: 'Chat session deleted successfully'
    });
  } catch (error) {
    console.error('Chat delete API error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete chat session',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
