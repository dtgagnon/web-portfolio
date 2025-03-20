import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function startDevServer() {
  try {
    console.log('Starting development server...');
    
    const port = process.env.PORT || '3000';
    
    // Use the same configuration as our npm script and pass PORT env var
    const serverProcess = exec(
      `PORT=${port} ` +
      'NODE_OPTIONS="--no-warnings" ' +
      'node ' +
      '--loader ts-node/esm/transpile-only ' +
      '--experimental-specifier-resolution=node ' +
      'server/index.ts'
    );
    
    // Forward stdout and stderr
    serverProcess.stdout?.on('data', (data) => {
      console.log(`Server: ${data}`);
    });
    
    serverProcess.stderr?.on('data', (data) => {
      console.error(`Server Error: ${data}`);
    });
    
    console.log('Development server started successfully!');
    console.log(`Server running at http://localhost:${port}`);
    
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