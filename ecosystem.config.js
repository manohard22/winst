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
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_file: './logs/backend.log',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log'
    },
    {
      name: 'winst-frontend',
      script: './static-server.js',
      args: ['5173', './frontend/dist'],
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      log_file: './logs/frontend.log',
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log'
    },
    {
      name: 'winst-admin',
      script: './static-server.js',
      args: ['5174', './admin-portal/dist'],
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      log_file: './logs/admin.log',
      error_file: './logs/admin-error.log',
      out_file: './logs/admin-out.log'
    }
  ]
};
