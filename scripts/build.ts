import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

async function buildProject() {
  try {
    console.log('Building project...');
    
    // Create dist directory if it doesn't exist
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }
    
    // Build the frontend with Vite (this is now handled by the npm script)
    console.log('Frontend build is handled by Vite in the npm script...');
    
    // Compile server TypeScript files
    console.log('Compiling server TypeScript files...');
    await execAsync('NODE_OPTIONS=--loader=ts-node/esm npx tsc --project tsconfig.build.json');
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildProject();