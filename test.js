#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runTests() {
  console.log('🧪 Running Symphony of One MCP tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  function test(name, fn) {
    try {
      fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (error) {
      console.log(`✗ ${name}: ${error.message}`);
      failed++;
    }
  }
  
  async function asyncTest(name, fn) {
    try {
      await fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (error) {
      console.log(`✗ ${name}: ${error.message}`);
      failed++;
    }
  }
  
  // Test file structure
  const requiredFiles = [
    'package.json',
    'mcp-server.js', 
    'server.js',
    'cli.js',
    'README.md',
    '.env.example'
  ];
  
  for (const file of requiredFiles) {
    await asyncTest(`Required file exists: ${file}`, async () => {
      await fs.access(path.join(__dirname, file));
    });
  }
  
  // Test package.json structure
  await asyncTest('package.json is valid JSON', async () => {
    const pkg = JSON.parse(await fs.readFile(path.join(__dirname, 'package.json'), 'utf-8'));
    if (!pkg.name || !pkg.version || !pkg.description) {
      throw new Error('Missing required package.json fields');
    }
  });
  
  // Test executable permissions
  const executables = ['mcp-server.js', 'server.js', 'cli.js'];
  for (const file of executables) {
    await asyncTest(`${file} has shebang`, async () => {
      const content = await fs.readFile(path.join(__dirname, file), 'utf-8');
      if (!content.startsWith('#!/usr/bin/env node')) {
        throw new Error('Missing or incorrect shebang');
      }
    });
  }
  
  // Test imports
  await asyncTest('MCP server imports are valid', async () => {
    const content = await fs.readFile(path.join(__dirname, 'mcp-server.js'), 'utf-8');
    if (!content.includes('@modelcontextprotocol/sdk')) {
      throw new Error('Missing MCP SDK import');
    }
    if (!content.includes('axios')) {
      throw new Error('Missing axios import');
    }
  });
  
  await asyncTest('Hub server imports are valid', async () => {
    const content = await fs.readFile(path.join(__dirname, 'server.js'), 'utf-8');
    if (!content.includes('express')) {
      throw new Error('Missing express import');
    }
    if (!content.includes('socket.io')) {
      throw new Error('Missing socket.io import');
    }
    if (!content.includes('winston')) {
      throw new Error('Missing winston import');
    }
  });
  
  // Test README content
  await asyncTest('README has required sections', async () => {
    const readme = await fs.readFile(path.join(__dirname, 'README.md'), 'utf-8');
    const requiredSections = [
      '# Symphony of One MCP',
      '## Architecture', 
      '## Quick Start',
      '## Available Tools',
      '## API Endpoints'
    ];
    
    for (const section of requiredSections) {
      if (!readme.includes(section)) {
        throw new Error(`Missing README section: ${section}`);
      }
    }
  });
  
  // Test environment configuration
  await asyncTest('.env.example has required variables', async () => {
    const envExample = await fs.readFile(path.join(__dirname, '.env.example'), 'utf-8');
    const requiredVars = [
      'CHAT_SERVER_URL',
      'PORT',
      'SHARED_DIR',
      'AGENT_NAME'
    ];
    
    for (const variable of requiredVars) {
      if (!envExample.includes(variable)) {
        throw new Error(`Missing environment variable: ${variable}`);
      }
    }
  });
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed > 0) {
    console.log('❌ Some tests failed. Please fix issues before publishing.');
    process.exit(1);
  } else {
    console.log('✅ All tests passed! Ready for npm publish.');
  }
}

runTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});