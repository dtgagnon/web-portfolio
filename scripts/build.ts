import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { cpSync } from 'fs';

const execAsync = promisify(exec);

async function buildProject() {
  try {
    console.log('Building project...');
    
    // Create dist directory if it doesn't exist
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }
    
    // Create client dist directory if it doesn't exist
    if (!fs.existsSync('dist/client')) {
      fs.mkdirSync('dist/client', { recursive: true });
    }
    
    // Copy client files to dist
    console.log('Copying client files...');
    cpSync('client', 'dist/client', { recursive: true });
    
    // Compile TypeScript files
    console.log('Compiling TypeScript files...');
    await execAsync('NODE_OPTIONS=--loader=ts-node/esm npx tsc --project tsconfig.build.json');
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildProject();