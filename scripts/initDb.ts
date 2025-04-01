#!/usr/bin/env node

import { initializeDatabase } from '../lib/database/dbClient';
import path from 'path';
import fs from 'fs';

/**
 * Database initialization script
 * 
 * This script ensures the SQLite database is properly initialized with all required tables.
 * It can be run manually or as part of the application startup process.
 */
function initDb() {
  console.log('Initializing database...');
  
  // First, ensure the data directory exists
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    console.log(`Creating data directory at ${dataDir}`);
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Create an empty database file if it doesn't exist
  const dbPath = path.join(dataDir, 'portfolio.db');
  if (!fs.existsSync(dbPath)) {
    console.log(`Creating empty database file at ${dbPath}`);
    fs.writeFileSync(dbPath, ''); // Create empty file
  }
  
  try {
    initializeDatabase();
    console.log(`✅ Database initialized successfully at: ${dbPath}`);
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    console.error('Detailed error:', error instanceof Error ? error.stack : String(error));
    process.exit(1);
  }
}

// Run the initialization
initDb();
