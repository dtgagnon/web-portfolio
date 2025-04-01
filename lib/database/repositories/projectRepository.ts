import { getDbConnection } from '../dbClient';
import { Project } from '../models/types';
import { randomUUID } from 'crypto';

export class ProjectRepository {
  // Get a project by ID
  static findById(id: string): Project | null {
    const db = getDbConnection();
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | undefined;
    db.close();
    return project || null;
  }

  // Create a new project
  static create(data: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Project {
    const db = getDbConnection();
    const id = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    
    db.prepare(`
      INSERT INTO projects (id, title, description, content, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, data.title, data.description, data.content, now, now);
      
    const project = this.findById(id);
    db.close();
    
    if (!project) {
      throw new Error('Failed to create project');
    }
    
    return project;
  }

  // Update a project
  static update(id: string, data: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>): Project | null {
    const db = getDbConnection();
    const project = this.findById(id);
    
    if (!project) {
      db.close();
      return null;
    }
    
    // Build update query dynamically based on provided fields
    const fields: string[] = [];
    const values: any[] = [];
    
    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }
    
    if (data.content !== undefined) {
      fields.push('content = ?');
      values.push(data.content);
    }
    
    // Always update the updated_at timestamp
    const now = Math.floor(Date.now() / 1000);
    fields.push('updated_at = ?');
    values.push(now);
    
    if (fields.length > 0) {
      const query = `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`;
      values.push(id);
      db.prepare(query).run(...values);
    }
    
    const updatedProject = this.findById(id);
    db.close();
    return updatedProject;
  }

  // Delete a project
  static delete(id: string): boolean {
    const db = getDbConnection();
    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    db.close();
    return result.changes > 0;
  }

  // Get all projects
  static findAll(): Project[] {
    const db = getDbConnection();
    const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all() as Project[];
    db.close();
    return projects;
  }

  // Link a project to a chat message
  static linkToChatMessage(projectId: string, chatMessageId: string): void {
    const db = getDbConnection();
    const id = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    
    db.prepare(`
      INSERT INTO chat_project_links (id, project_id, chat_message_id, created_at) 
      VALUES (?, ?, ?, ?)
    `).run(id, projectId, chatMessageId, now);
    
    db.close();
  }

  // Get projects linked to a specific chat message
  static findByMessageId(messageId: string): Project[] {
    const db = getDbConnection();
    const projects = db.prepare(`
      SELECT p.* FROM projects p
      JOIN chat_project_links l ON p.id = l.project_id
      WHERE l.chat_message_id = ?
      ORDER BY p.created_at DESC
    `).all(messageId) as Project[];
    db.close();
    return projects;
  }
}
