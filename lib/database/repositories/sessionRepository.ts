import { getDbConnection } from '../dbClient';
import { Session } from '../models/types';
import { randomUUID } from 'crypto';

export class SessionRepository {
  // Get a session by ID
  static findById(id: string): Session | null {
    const db = getDbConnection();
    const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as Session | undefined;
    db.close();
    return session || null;
  }

  // Create a new session
  static create(userId?: string): Session {
    const db = getDbConnection();
    const id = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    
    db.prepare(`
      INSERT INTO sessions (id, user_id, created_at, last_active_at) 
      VALUES (?, ?, ?, ?)
    `).run(id, userId || null, now, now);
      
    const session = this.findById(id);
    db.close();
    
    if (!session) {
      throw new Error('Failed to create session');
    }
    
    return session;
  }

  // Update last active time
  static updateActivity(id: string): boolean {
    const db = getDbConnection();
    const now = Math.floor(Date.now() / 1000);
    const result = db.prepare('UPDATE sessions SET last_active_at = ? WHERE id = ?').run(now, id);
    db.close();
    return result.changes > 0;
  }

  // Associate a user with a session
  static setUserId(id: string, userId: string): boolean {
    const db = getDbConnection();
    const result = db.prepare('UPDATE sessions SET user_id = ? WHERE id = ?').run(userId, id);
    db.close();
    return result.changes > 0;
  }

  // Get sessions by user ID
  static findByUserId(userId: string): Session[] {
    const db = getDbConnection();
    const sessions = db.prepare(
      'SELECT * FROM sessions WHERE user_id = ? ORDER BY last_active_at DESC'
    ).all(userId) as Session[];
    db.close();
    return sessions;
  }

  // Delete a session
  static delete(id: string): boolean {
    const db = getDbConnection();
    const result = db.prepare('DELETE FROM sessions WHERE id = ?').run(id);
    db.close();
    return result.changes > 0;
  }

  // Clean up old sessions (older than 30 days)
  static cleanupOldSessions(): number {
    const db = getDbConnection();
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
    const result = db.prepare('DELETE FROM sessions WHERE last_active_at < ?').run(thirtyDaysAgo);
    db.close();
    return result.changes;
  }
}
