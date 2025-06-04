// Simple script to verify LLM configuration
const fs = require('fs');
const path = require('path');

// Read the config file
const configPath = path.join(__dirname, '../lib/api/llm/config.ts');
const configContent = fs.readFileSync(configPath, 'utf-8');

// Read env.local if available (won't show the content)
let envExists = false;
try {
  fs.accessSync(path.join(__dirname, '../.env.local'), fs.constants.R_OK);
  envExists = true;
} catch (err) {
  // File does not exist or is not readable
}

console.log('LLM Configuration Test');
console.log('-----------------------');
console.log('Config file exists:', fs.existsSync(configPath));

const activeProviderMatch = configContent.match(/export const ACTIVE_PROVIDER: LLMProvider =\s*\(?process\.env\.NEXT_PUBLIC_LLM_PROVIDER as LLMProvider\)? \|\| '(\w+)'/);
if (activeProviderMatch) {
  console.log('Default provider:', activeProviderMatch[1]);
}

console.log('.env.local exists:', envExists);
console.log('Current process.env.NEXT_PUBLIC_LLM_PROVIDER:', process.env.NEXT_PUBLIC_LLM_PROVIDER || '(not set)');
console.log('-----------------------');
console.log('To switch providers:');
console.log('1. Edit .env.local and set NEXT_PUBLIC_LLM_PROVIDER=openai or NEXT_PUBLIC_LLM_PROVIDER=gemini');
console.log('2. Restart the Next.js development server');
