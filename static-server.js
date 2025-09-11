const express = require('express');
const path = require('path');

// Get command line arguments
const port = process.argv[2];
const distPath = process.argv[3];

if (!port || !distPath) {
  console.error('Usage: node static-server.js <port> <dist-path>');
  process.exit(1);
}

const app = express();

// Serve static files
app.use(express.static(path.resolve(distPath)));

// Handle client-side routing - serve index.html for all non-API routes
app.use((req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Static server running on http://0.0.0.0:${port}`);
  console.log(`📁 Serving: ${path.resolve(distPath)}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Static server shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Static server shutting down...');
  process.exit(0);
});
