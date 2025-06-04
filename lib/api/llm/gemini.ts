import { VertexAI } from '@google-cloud/vertexai';
import fs from 'fs';
import path from 'path';

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || '',
  location: process.env.GOOGLE_CLOUD_LOCATION || '',
});

/**
 * Retrieves Gemini system instructions from secure sources
 */
export function getSystemInstructions(): string {
  // First try environment variable
  if (process.env.GEMINI_SYSTEM_INSTRUCTIONS) {
    return process.env.GEMINI_SYSTEM_INSTRUCTIONS;
  }
  
  // Try to read from the systemInst.md file
  try {
    const systemInstPath = path.resolve(process.cwd(), 'lib/api/llm/systemInst.md');
    return fs.readFileSync(systemInstPath, 'utf-8');
  } catch (systemInstError) {
    console.warn(`Could not read systemInst.md: ${systemInstError}`);
    
    // Then try file path from environment variable as fallback
    const filePath = process.env.GEMINI_INSTRUCTIONS_FILE_PATH;
    if (filePath) {
      try {
        return fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');
      } catch (error) {
        console.warn(`Could not read Gemini instructions file: ${error}`);
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

/**
 * Creates a configured Gemini model instance with system instructions
 */
export function getModel(modelName = 'gemini-2.5-flash-preview-05-20') {
  return vertexAI.getGenerativeModel({
    model: modelName,
    systemInstruction: {
      role: 'system',
      parts: [{ text: getSystemInstructions() }],
    }
  });
}
