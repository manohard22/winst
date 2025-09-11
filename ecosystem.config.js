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
  script: '/usr/local/bin/serve',
  args: ['-s', './frontend/dist', '-p', '5173'],
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      log_file: './logs/frontend.log',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log'
    },
    {
      name: 'winst-admin',
  script: '/usr/local/bin/serve',
  args: ['-s', './admin-portal/dist', '-p', '5174'],
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      log_file: './logs/admin.log',
      error_file: './logs/admin-error.log',
      out_file: './logs/admin-out.log'
    }
  ]
};