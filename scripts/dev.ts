import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function startDevServer() {
  try {
    // Start the server with ts-node
    console.log('Starting development server...');
    
    // Run the server in the background
    const serverProcess = exec('npx ts-node --esm server/index.ts');
    
    // Forward stdout and stderr
    serverProcess.stdout?.on('data', (data) => {
      console.log(`Server: ${data}`);
    });
    
    serverProcess.stderr?.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });
    
    console.log('Development server started successfully!');
    console.log('Server running at http://localhost:3000');
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('Shutting down development server...');
      serverProcess.kill();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start development server:', error);
    process.exit(1);
  }
}

startDevServer();