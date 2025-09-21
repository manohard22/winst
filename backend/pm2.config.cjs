module.exports = {
  apps: [
    {
      name: 'winst-backend',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3001,
        HOST: process.env.HOST || '0.0.0.0'
      },
      error_file: '../logs/backend-error.log',
      out_file: '../logs/backend-out.log',
      log_file: '../logs/backend-combined.log',
      max_memory_restart: '1G'
    }
  ]
};
