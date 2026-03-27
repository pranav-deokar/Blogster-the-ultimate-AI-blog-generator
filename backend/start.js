#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking backend configuration...\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (process.env.NODE_ENV !== "production") {
  console.log("Running in development mode");
}

// Load environment variables
require('dotenv').config();

// Check required variables
const required = ['OPENROUTER_API_KEY', 'MODEL_NAME', 'BASE_URL'];
const missing = [];

required.forEach(key => {
  if (!process.env[key]) {
    missing.push(key);
  }
});

if (missing.length > 0) {
  console.error('❌ ERROR: Missing required environment variables:');
  missing.forEach(key => console.log(`   - ${key}`));
  console.log('\n📝 Please update your .env file\n');
  process.exit(1);
}

// Verify API key format
if (process.env.OPENROUTER_API_KEY.includes('your_') || 
    process.env.OPENROUTER_API_KEY.includes('example')) {
  console.error('❌ ERROR: Please set a valid OPENROUTER_API_KEY in .env');
  console.log('   Get your key from: https://openrouter.ai/\n');
  process.exit(1);
}

console.log('✅ Configuration verified!');
console.log('📊 Settings:');
console.log(`   Model: ${process.env.MODEL_NAME}`);
console.log(`   Port: ${process.env.PORT || 3001}`);
console.log(`   Environment: ${process.env.NODE_ENV || 'production'}\n`);

console.log('🚀 Starting server...\n');
require('./server.js');
