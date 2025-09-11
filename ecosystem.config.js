module.exports = {
  apps: [
    {
      name: 'winst-backend',
  script: './server.js',
  cwd: './backend',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOST: '0.0.0.0'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_file: './logs/backend.log',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log'
    },
    {
      name: 'winst-frontend',
      script: 'serve',
  args: ['-s', './frontend/dist', '-l', '5173', '-H', '0.0.0.0'],
      instances: 1,
      autorestart: true,
      watch: false
    },
    {
      name: 'winst-admin',
      script: 'serve',
  args: ['-s', './admin-portal/dist', '-l', '5174', '-H', '0.0.0.0'],
      instances: 1,
      autorestart: true,
      watch: false
    }
  ]
};