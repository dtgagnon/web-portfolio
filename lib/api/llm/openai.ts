import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Import types from their specific submodules or main namespace
import type { Assistant } from 'openai/resources/beta/assistants';
// Remove problematic imports, will use qualified names
// import type { Thread } from 'openai/resources/beta/threads';
// import type { Run } from 'openai/resources/beta/threads/runs';
// Keep specific message/annotation types from their submodule
import { 
  Message as ThreadMessage,
  MessageContentPartParam,
  MessageCreateParams,
  Annotation as TextAnnotation, 
  FileCitationAnnotation,
  FilePathAnnotation
} from 'openai/resources/beta/threads/messages'; 


// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AssistantCreationOptions {
  name?: string;
  instructionsFilePath?: string;
  instructions?: string; 
  model?: string;
  tools?: Array<{ type: 'code_interpreter' | 'file_search' | 'function' }>; 
  // TODO: Add tool_resources if needed
}

export type ExtendedMessageContentPartParam = MessageContentPartParam;

export interface AddMessageOptions {
  role: 'user';
  content: string | Array<ExtendedMessageContentPartParam>; 
  attachments?: MessageCreateParams.Attachment[]; 
  // TODO: Add metadata if needed
}

// --- Assistant Management ---

/**
 * Creates or retrieves an OpenAI Assistant.
 * TODO: Implement retrieval or persistent storage of assistant ID.
 */
/**
 * Get system instructions from the shared systemInst.md file
 */
export function getSystemInstructions(): string {
  // First try environment variable
  if (process.env.OPENAI_SYSTEM_INSTRUCTIONS) {
    return process.env.OPENAI_SYSTEM_INSTRUCTIONS;
  }
  
  // Try to read from the systemInst.md file
  try {
    const systemInstPath = path.resolve(process.cwd(), 'lib/api/llm/systemInst.md');
    return fs.readFileSync(systemInstPath, 'utf-8');
  } catch (systemInstError) {
    console.warn(`Could not read systemInst.md: ${systemInstError}`);
    
    // Then try file path from environment variable as fallback
    const filePath = process.env.OPENAI_INSTRUCTIONS_FILE_PATH;
    if (filePath) {
      try {
        return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');
      } catch (error) {
        console.warn(`Could not read OpenAI instructions file: ${error}`);
      }
    }
  }
  
  // Fallback - summary of systemInst.md
  return `You are a chat interface for Derek Gagnon's portfolio website, acting as an advocate based on reference documents. 
  Handle user chat messages by responding positively, showcasing Derek's experiences and expertise. 
  Follow these steps: (1) understand the user query, (2) reference context from available documents, 
  (3) craft a positive response highlighting Derek's strengths, (4) verify accuracy, and 
  (5) conclude with affirmation. Keep responses concise, supportive, and accurate to Derek's experience.`;
}

export async function createAssistant(options?: AssistantCreationOptions) {
  const config = {
    name: "Portfolio Liason",
    model: "gpt-4o",
    tools: [{ type: "file_search" }] as Array<{ type: 'code_interpreter' | 'file_search' | 'function' }>, 
    ...options, 
  };

  // Use instructions from options, or get from systemInst.md
  let instructionsContent = options?.instructions ?? getSystemInstructions();

  if (!options?.instructions && config.instructionsFilePath) {
    try {
      const instructionsPath = path.resolve(process.cwd(), config.instructionsFilePath);
      instructionsContent = fs.readFileSync(instructionsPath, 'utf-8');
      console.log(`Read instructions from: ${instructionsPath}`);
    } catch (error) {
      console.warn(`Could not read instructions file at ${config.instructionsFilePath} (resolved to ${path.resolve(process.cwd(), config.instructionsFilePath)}):`, error);
    }
  }

  try {
    const assistant = await openai.beta.assistants.create({
      name: config.name,
      instructions: instructionsContent,
      tools: config.tools as any, 
      model: config.model,
    });
    console.log("Assistant created with ID:", assistant.id);
    return assistant;
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
}

// --- Thread Management ---

/**
 * Creates a new conversation thread.
 */
export async function createThread(): Promise<OpenAI.Beta.Threads.Thread> {
  try {
    const thread = await openai.beta.threads.create();
    console.log("Thread created with ID:", thread.id);
    return thread;
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error;
  }
}

/**
 * Adds a message to a specific thread.
 */
export async function addMessageToThread(threadId: string, message: AddMessageOptions) {
  try {
    const messageCreateParams: MessageCreateParams = {
      role: message.role,
      content: message.content,
      attachments: message.attachments,
    };
    const createdMessage = await openai.beta.threads.messages.create(
      threadId,
      messageCreateParams 
    );
    return createdMessage;
  } catch (error) {
    console.error(`Error adding message to thread ${threadId}:`, error);
    throw error;
  }
}

// --- Thread Deletion ---

/**
 * Deletes an OpenAI thread by its ID.
 */
export async function deleteThread(threadId: string): Promise<void> {
  try {
    await openai.beta.threads.del(threadId);
    console.log(`Successfully deleted thread ${threadId}`);
  } catch (error) {
    console.error(`Error deleting thread ${threadId}:`, error);
    // Decide if we should re-throw or just log
    throw error; // Re-throw to allow the caller to handle it
  }
}

// --- Run Management ---

const POLLING_INTERVAL_MS = 1000; 
const RUN_TIMEOUT_MS = 300000; 

/**
 * Runs an assistant on a specific thread and waits for completion.
 */
export async function runAssistantOnThread(
  threadId: string, 
  assistantId: string, 
  instructions?: string
): Promise<OpenAI.Beta.Threads.Runs.Run> {
  let run: OpenAI.Beta.Threads.Runs.Run;
  try {
    run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      instructions, 
    });
    console.log(`Run ${run.id} created for thread ${threadId}`);
  } catch (error) {
    console.error(`Error creating run for thread ${threadId}:`, error);
    throw error;
  }

  const startTime = Date.now();

  while (Date.now() - startTime < RUN_TIMEOUT_MS) {
    try {
      const runStatus: OpenAI.Beta.Threads.Runs.Run = await openai.beta.threads.runs.retrieve(threadId, run.id);

      console.log(`Run ${run.id} status: ${runStatus.status}`);

      switch (runStatus.status) {
        case 'completed':
          console.log(`Run ${run.id} completed successfully.`);
          return runStatus; 
        case 'queued':
        case 'in_progress':
          break;
        case 'requires_action':
          console.warn(`Run ${run.id} requires action (function calling not implemented).`);
          throw new Error(`Run requires action, but function calling is not implemented.`);
        case 'failed':
          console.error(`Run ${run.id} failed:`, runStatus.last_error);
          throw new Error(`Run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
        case 'cancelled':
          console.log(`Run ${run.id} was cancelled.`);
          throw new Error('Run was cancelled.');
        case 'cancelling':
          console.log(`Run ${run.id} is cancelling.`);
          break;
        case 'expired':
          console.error(`Run ${run.id} expired.`);
          throw new Error('Run expired.');
        case 'incomplete':
          console.warn(`Run ${run.id} is incomplete:`, runStatus.incomplete_details);
          throw new Error(`Run incomplete: ${runStatus.incomplete_details?.reason || 'Unknown reason'}`);
        default:
          console.error(`Unknown run status: ${runStatus.status}`);
          throw new Error(`Unknown run status: ${runStatus.status}`);
      }
    } catch (error) {
      console.error(`Error retrieving run status for run ${run.id}:`, error);
      throw error; 
    }

    await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS));
  }

  console.error(`Run ${run.id} timed out after ${RUN_TIMEOUT_MS / 1000} seconds.`);
  try {
    await openai.beta.threads.runs.cancel(threadId, run.id);
    console.log(`Attempted to cancel timed out run ${run.id}`);
  } catch (cancelError) {
    console.error(`Failed to cancel timed out run ${run.id}:`, cancelError);
  }
  throw new Error('Run timed out.');
}

// --- Message Retrieval and Processing ---

/**
 * Retrieves messages from a thread, processing annotations.
 */
export async function getMessagesFromThread(threadId: string, limit: number = 20, order: 'asc' | 'desc' = 'asc') {
  try {
    const messageList = await openai.beta.threads.messages.list(threadId, {
      limit,
      order,
    });

    const processedMessages = await Promise.all(
      messageList.data.map(async (message) => {
        return processMessageAnnotations(message);
      })
    );

    return processedMessages;
  } catch (error) {
    console.error(`Error retrieving messages from thread ${threadId}:`, error);
    throw error;
  }
}

/**
 * Processes annotations within a single message, replacing placeholders.
 */
async function processMessageAnnotations(message: ThreadMessage): Promise<ThreadMessage> {
  const processedContent: ThreadMessage['content'] = [];

  for (const contentBlock of message.content) {
    if (contentBlock.type === 'text' && contentBlock.text.annotations && contentBlock.text.annotations.length > 0) {
      let processedText = contentBlock.text.value;
      const citations: string[] = [];

      const annotations: TextAnnotation[] = contentBlock.text.annotations;
      
      const sortedAnnotations = [...annotations].sort((a, b) => a.start_index - b.start_index);

      for (let i = sortedAnnotations.length - 1; i >= 0; i--) {
        const annotation = sortedAnnotations[i];
        const placeholder = annotation.text; 
        let replacement = '';
        let citationText = '';

        try {
          if (annotation.type === 'file_citation') {
            const fileCitationAnn = annotation as FileCitationAnnotation;
            if (fileCitationAnn.file_citation?.file_id) {
              const citedFile = await openai.files.retrieve(fileCitationAnn.file_citation.file_id);
              replacement = ` [${i + 1}]`;
              // Construct citation without assuming a .quote property exists on file_citation
              // Use the placeholder text (annotation.text) or just the filename if needed.
              // Let's default to just referencing the file by name for now.
              citationText = `[${i + 1}] Reference from ${citedFile.filename}`;
            }
          } else if (annotation.type === 'file_path') {
            const filePathAnn = annotation as FilePathAnnotation;
            if (filePathAnn.file_path?.file_id) {
              const filePathFile = await openai.files.retrieve(filePathAnn.file_path.file_id);
              replacement = ` [Download ${filePathFile.filename}]`;
              citationText = `[${i + 1}] File generated: ${filePathFile.filename}`;
            }
          }
        } catch (fileError) {
          const fileId = annotation.type === 'file_citation' ? (annotation as FileCitationAnnotation).file_citation?.file_id 
                       : annotation.type === 'file_path' ? (annotation as FilePathAnnotation).file_path?.file_id 
                       : undefined;
          if (fileError instanceof OpenAI.APIError && fileError.status === 404) {
            console.warn(`File not found for annotation (ID: ${fileId}). It might have been deleted.`);
            replacement = ` [File not found]`;
          } else {
            console.error(`Error retrieving file for annotation: ${fileError}`);
            replacement = ` [Error retrieving file]`;
          }
        }

        if (placeholder && replacement) {
          processedText = processedText.substring(0, annotation.start_index) +
                          replacement +
                          processedText.substring(annotation.end_index);
        } else if (placeholder) {
           console.warn(`Annotation placeholder "${placeholder}" kept as no replacement logic matched.`);
        }
        
        if (citationText) {
          citations.push(citationText);
        }
      }
      
      if (citations.length > 0) {
        processedText += '\n\n**References:**\n' + citations.reverse().join('\n');
      }

      processedContent.push({
        type: 'text',
        text: {
          value: processedText,
          annotations: [], 
        },
      });

    } else {
      processedContent.push(contentBlock);
    }
  }

  return {
    ...message,
    content: processedContent,
  };
}
