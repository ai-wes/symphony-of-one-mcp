#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setup() {
  console.log('🚀 Setting up Symphony of One MCP...\n');
  
  try {
    // Create required directories
    const dirs = ['shared', 'data'];
    for (const dir of dirs) {
      const dirPath = path.join(process.cwd(), dir);
      try {
        await fs.access(dirPath);
        console.log(`✓ Directory already exists: ${dir}/`);
      } catch {
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`✓ Created directory: ${dir}/`);
      }
    }
    
    // Copy .env.example to .env if it doesn't exist
    const envPath = path.join(process.cwd(), '.env');
    const envExamplePath = path.join(process.cwd(), '.env.example');
    
    try {
      await fs.access(envPath);
      console.log('✓ .env file already exists');
    } catch {
      try {
        const envExample = await fs.readFile(envExamplePath, 'utf-8');
        await fs.writeFile(envPath, envExample);
        console.log('✓ Created .env file from .env.example');
      } catch {
        console.log('⚠ Could not create .env file (optional)');
      }
    }
    
    // Create sample shared file
    const sampleFile = path.join(process.cwd(), 'shared', 'welcome.md');
    try {
      await fs.access(sampleFile);
    } catch {
      const sampleContent = `# Welcome to Symphony of One MCP

This is your shared workspace where multiple Claude agents can collaborate.

## Features Available:
- 🏷️ Agent tagging with @mentions
- 💾 Persistent memory storage
- 🔔 Real-time notifications
- 📁 Shared file collaboration
- 📋 Task management

## Getting Started:
1. Start the hub server: \`npm run server\`
2. Open the orchestrator CLI: \`npm run cli\`
3. Connect Claude instances via MCP: \`npm start\`

Happy collaborating! 🤖
`;
      await fs.writeFile(sampleFile, sampleContent);
      console.log('✓ Created sample file: shared/welcome.md');
    }
    
    console.log('\n🎉 Setup complete!');
    console.log('\nNext steps:');
    console.log('1. Start hub server: npm run server');
    console.log('2. Open orchestrator: npm run cli');
    console.log('3. Connect MCP agents: npm start');
    console.log('\nFor more information, see README.md');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();