// Simple script to run the development server on Windows
import { spawn } from 'child_process';

// Set environment variables
process.env.NODE_ENV = 'development';
process.env.PORT = '3000';

// Run the server
const child = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  shell: true
});

child.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});
