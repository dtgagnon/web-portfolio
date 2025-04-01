/**
 * Simple JSON file-based storage system
 * 
 * This is a temporary solution to work around native SQLite binding issues in NixOS
 * It mimics the behavior of the SQLite database but uses JSON files instead
 */

import fs from 'fs';
import path from 'path';
import { ChatMessage } from './models/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const TELEMETRY_FILE = path.join(DATA_DIR, 'telemetry.json');

// Ensure data directory exists
export function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  // Create files if they don't exist
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify([]));
  }
  
  if (!fs.existsSync(SESSIONS_FILE)) {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify([]));
  }
  
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  
  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify([]));
  }
  
  if (!fs.existsSync(TELEMETRY_FILE)) {
    fs.writeFileSync(TELEMETRY_FILE, JSON.stringify([]));
  }
}

// Read messages from file
export function readMessages(): ChatMessage[] {
  try {
    const data = fs.readFileSync(MESSAGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading messages file:', error);
    return [];
  }
}

// Write messages to file
export function writeMessages(messages: ChatMessage[]) {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Error writing messages file:', error);
  }
}

// Generic read function for any file
export function readJsonFile<T>(filePath: string): T[] {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

// Generic write function for any file
export function writeJsonFile<T>(filePath: string, data: T[]) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
}

// Export constants for other modules to use
export { MESSAGES_FILE, SESSIONS_FILE, USERS_FILE, PROJECTS_FILE, TELEMETRY_FILE };
