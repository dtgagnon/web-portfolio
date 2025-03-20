import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function startDevServer() {
  try {
    console.log('Starting development servers...');
    
    // Start the backend server on port 3001
    const backendPort = '3001';
    const backendProcess = exec(
      `PORT=${backendPort} ` +
      'NODE_OPTIONS="--no-warnings" ' +
      'node ' +
      '--loader ts-node/esm/transpile-only ' +
      '--experimental-specifier-resolution=node ' +
      'server/index.ts'
    );
    
    // Forward backend stdout and stderr
    backendProcess.stdout?.on('data', (data) => {
      console.log(`Backend: ${data}`);
    });
    
    backendProcess.stderr?.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
    });
    
    console.log(`Backend server running at http://localhost:${backendPort}`);
    
    // Start the frontend Vite server
    const frontendPort = process.env.PORT || '3000';
    const frontendProcess = exec(`npx vite --port ${frontendPort}`);
    
    // Forward frontend stdout and stderr
    frontendProcess.stdout?.on('data', (data) => {
      console.log(`Frontend: ${data}`);
    });
    
    frontendProcess.stderr?.on('data', (data) => {
      console.error(`Frontend Error: ${data}`);
    });
    
    console.log(`Frontend server running at http://localhost:${frontendPort}`);
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('Shutting down development servers...');
      backendProcess.kill();
      frontendProcess.kill();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start development servers:', error);
    process.exit(1);
  }
}

startDevServer();