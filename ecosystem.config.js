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
      }
    },
    {
      name: 'winst-frontend',
      script: 'npx',
      args: 'serve -s ./frontend/dist -l 5173 -H 0.0.0.0',
      instances: 1,
      autorestart: true,
      watch: false
    },
    {
      name: 'winst-admin', 
      script: 'npx',
      args: 'serve -s ./admin-portal/dist -l 5174 -H 0.0.0.0',
      instances: 1,
      autorestart: true,
      watch: false
    }
  ]
};