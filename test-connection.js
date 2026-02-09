#!/usr/bin/env node

/**
 * Caliber Backend Connection Tester
 * Run: node test-connection.js
 */

import axios from 'axios';

const API_BASE = 'http://localhost:5000';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

console.log(`\n${colors.blue}🔍 Caliber Backend Connection Tester${colors.reset}\n`);

const tests = [
  {
    name: 'Health Check',
    method: 'GET',
    url: `${API_BASE}/health`,
    expected: 200,
  },
  {
    name: 'Get Jobs',
    method: 'GET',
    url: `${API_BASE}/api/jobs`,
    expected: 200,
  },
];

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      const response = await axios({
        method: test.method,
        url: test.url,
        timeout: 5000,
      });

      if (response.status === test.expected) {
        console.log(
          `${colors.green}✓ PASS${colors.reset} - ${test.name} (${response.status})\n`
        );
        passed++;
      } else {
        console.log(
          `${colors.red}✗ FAIL${colors.reset} - ${test.name} (Expected ${test.expected}, got ${response.status})\n`
        );
        failed++;
      }
    } catch (error) {
      console.log(
        `${colors.red}✗ FAIL${colors.reset} - ${test.name} (${error.message})\n`
      );
      failed++;
    }
  }

  console.log(`${colors.blue}Results:${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}\n`);

  if (failed > 0) {
    console.log(`${colors.yellow}⚠️  Backend not responding!${colors.reset}`);
    console.log('Make sure:');
    console.log('1. Backend is running: cd backend && npm run dev');
    console.log('2. MongoDB is running (local or Atlas configured)');
    console.log('3. .env file exists with correct MONGODB_URI\n');
    process.exit(1);
  } else {
    console.log(
      `${colors.green}✅ All tests passed! Backend is connected!${colors.reset}\n`
    );
  }
}

runTests();
