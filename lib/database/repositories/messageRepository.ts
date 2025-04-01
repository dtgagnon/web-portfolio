import { getDbConnection } from '../dbClient';
import { ChatMessage } from '../models/types';
import { randomUUID } from 'crypto';

export class MessageRepository {
  // Get a message by ID
  static findById(id: string): ChatMessage | null {
    const db = getDbConnection();
    const message = db.prepare('SELECT * FROM chat_messages WHERE id = ?').get(id) as ChatMessage | undefined;
    db.close();
    return message || null;
  }

  // Create a new message
  static create(data: Omit<ChatMessage, 'id' | 'created_at'>): ChatMessage {
    const db = getDbConnection();
    const id = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    
    db.prepare(`
      INSERT INTO chat_messages (id, user_id, content, role, session_id, created_at) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, data.user_id, data.content, data.role, data.session_id, now);
      
    const message = this.findById(id);
    db.close();
    
    if (!message) {
      throw new Error('Failed to create message');
    }
    
    return message;
  }

  // Get messages by session ID
  static findBySessionId(sessionId: string): ChatMessage[] {
    const db = getDbConnection();
    const messages = db.prepare(
      'SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC'
    ).all(sessionId) as ChatMessage[];
    db.close();
    return messages;
  }

  // Get messages by user ID
  static findByUserId(userId: string): ChatMessage[] {
    const db = getDbConnection();
    const messages = db.prepare(
      'SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC'
    ).all(userId) as ChatMessage[];
    db.close();
    return messages;
  }

  // Delete messages by session ID
  static deleteBySessionId(sessionId: string): boolean {
    const db = getDbConnection();
    const result = db.prepare('DELETE FROM chat_messages WHERE session_id = ?').run(sessionId);
    db.close();
    return result.changes > 0;
  }

  // Delete a specific message
  static delete(id: string): boolean {
    const db = getDbConnection();
    const result = db.prepare('DELETE FROM chat_messages WHERE id = ?').run(id);
    db.close();
    return result.changes > 0;
  }

  // Find messages that reference a specific project
  static findByProjectId(projectId: string): ChatMessage[] {
    const db = getDbConnection();
    const messages = db.prepare(`
      SELECT m.* FROM chat_messages m
      JOIN chat_project_links l ON m.id = l.chat_message_id
      WHERE l.project_id = ?
      ORDER BY m.created_at DESC
    `).all(projectId) as ChatMessage[];
    db.close();
    return messages;
  }
}
