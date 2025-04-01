import { getDbConnection } from '../dbClient';
import { User } from '../models/types';
import { randomUUID } from 'crypto';

export class UserRepository {
  // Get a user by ID
  static findById(id: string): User | null {
    const db = getDbConnection();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined;
    db.close();
    return user || null;
  }

  // Get a user by email
  static findByEmail(email: string): User | null {
    const db = getDbConnection();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
    db.close();
    return user || null;
  }

  // Create a new user
  static create(email: string, name?: string): User {
    const db = getDbConnection();
    const id = randomUUID();
    const now = Math.floor(Date.now() / 1000);
    
    db.prepare('INSERT INTO users (id, email, name, created_at) VALUES (?, ?, ?, ?)')
      .run(id, email, name || null, now);
      
    const user = this.findById(id);
    db.close();
    
    if (!user) {
      throw new Error('Failed to create user');
    }
    
    return user;
  }

  // Update a user
  static update(id: string, data: Partial<Omit<User, 'id' | 'created_at'>>): User | null {
    const db = getDbConnection();
    const user = this.findById(id);
    
    if (!user) {
      db.close();
      return null;
    }
    
    // Build update query dynamically based on provided fields
    const fields: string[] = [];
    const values: any[] = [];
    
    if (data.email !== undefined) {
      fields.push('email = ?');
      values.push(data.email);
    }
    
    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    
    if (fields.length > 0) {
      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      values.push(id);
      db.prepare(query).run(...values);
    }
    
    const updatedUser = this.findById(id);
    db.close();
    return updatedUser;
  }

  // Delete a user
  static delete(id: string): boolean {
    const db = getDbConnection();
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(id);
    db.close();
    return result.changes > 0;
  }

  // Get all users
  static findAll(): User[] {
    const db = getDbConnection();
    const users = db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as User[];
    db.close();
    return users;
  }
}
