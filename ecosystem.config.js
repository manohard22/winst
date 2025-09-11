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
      max_memory_restart: '1G'
    },
    {
      name: 'winst-frontend',
      script: './static-server.js',
      args: ['5173', './frontend/dist'],
      instances: 1,
      autorestart: true,
      watch: false
    },
    {
      name: 'winst-admin',
      script: './static-server.js',
      args: ['5174', './admin-portal/dist'],
      instances: 1,
      autorestart: true,
      watch: false
    }
  ]
};
