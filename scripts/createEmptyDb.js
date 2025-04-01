#!/usr/bin/env node

/**
 * Simple database initialization script
 * 
 * This script creates an empty database structure in the data directory.
 * It doesn't rely on SQLite bindings, making it compatible with NixOS environments.
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio.db');

// Create empty database structure
function createEmptyDbStructure() {
  console.log('Creating database structure...');
  
  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    console.log(`Creating data directory at ${DATA_DIR}`);
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  // Create the database file if it doesn't exist
  if (!fs.existsSync(DB_FILE)) {
    console.log(`Creating database file at ${DB_FILE}`);
    fs.writeFileSync(DB_FILE, '');
  }
  
  // Add a .gitkeep file to ensure the directory is tracked
  const gitkeepFile = path.join(DATA_DIR, '.gitkeep');
  if (!fs.existsSync(gitkeepFile)) {
    fs.writeFileSync(gitkeepFile, '');
  }
  
  console.log('✅ Database structure created successfully');
  console.log('Note: This is only a placeholder file structure. Actual database initialization');
  console.log('will happen when you first use the chat functionality.');
}

createEmptyDbStructure();
