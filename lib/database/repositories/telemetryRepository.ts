import { getDbConnection } from '../dbClient';
import { TelemetryEvent } from '../models/types';
import { randomUUID } from 'crypto';

export class TelemetryRepository {
  // Record a new telemetry event
  static recordEvent(
    eventType: string, 
    eventData?: any, 
    userId?: string, 
    sessionId?: string
  ): TelemetryEvent {
    const db = getDbConnection();
    const id = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const serializedData = eventData ? JSON.stringify(eventData) : null;
    
    db.prepare(`
      INSERT INTO telemetry_events (id, event_type, event_data, user_id, session_id, created_at) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, eventType, serializedData, userId || null, sessionId || null, now);
      
    const event = db.prepare('SELECT * FROM telemetry_events WHERE id = ?').get(id) as TelemetryEvent;
    db.close();
    
    if (!event) {
      throw new Error('Failed to record telemetry event');
    }
    
    return event;
  }

  // Get events by session ID
  static findBySessionId(sessionId: string): TelemetryEvent[] {
    const db = getDbConnection();
    const events = db.prepare(
      'SELECT * FROM telemetry_events WHERE session_id = ? ORDER BY created_at DESC'
    ).all(sessionId) as TelemetryEvent[];
    db.close();
    return events;
  }

  // Get events by user ID
  static findByUserId(userId: string): TelemetryEvent[] {
    const db = getDbConnection();
    const events = db.prepare(
      'SELECT * FROM telemetry_events WHERE user_id = ? ORDER BY created_at DESC'
    ).all(userId) as TelemetryEvent[];
    db.close();
    return events;
  }

  // Get events by type
  static findByType(eventType: string): TelemetryEvent[] {
    const db = getDbConnection();
    const events = db.prepare(
      'SELECT * FROM telemetry_events WHERE event_type = ? ORDER BY created_at DESC'
    ).all(eventType) as TelemetryEvent[];
    db.close();
    return events;
  }

  // Get events by time range
  static findByTimeRange(startTime: number, endTime: number): TelemetryEvent[] {
    const db = getDbConnection();
    const events = db.prepare(
      'SELECT * FROM telemetry_events WHERE created_at BETWEEN ? AND ? ORDER BY created_at DESC'
    ).all(startTime, endTime) as TelemetryEvent[];
    db.close();
    return events;
  }

  // Clean up old events (older than 90 days)
  static cleanupOldEvents(): number {
    const db = getDbConnection();
    const ninetyDaysAgo = Math.floor(Date.now() / 1000) - (90 * 24 * 60 * 60);
    const result = db.prepare('DELETE FROM telemetry_events WHERE created_at < ?').run(ninetyDaysAgo);
    db.close();
    return result.changes;
  }
}
