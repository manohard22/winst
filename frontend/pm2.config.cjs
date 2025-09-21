module.exports = {
  apps: [
    {
      name: 'winst-frontend',
      script: 'npx',
      args: ['serve', '-s', 'dist', '-p', process.env.FRONTEND_PORT || '5173'],
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production'
      },
      error_file: '../logs/frontend-error.log',
      out_file: '../logs/frontend-out.log',
      log_file: '../logs/frontend-combined.log'
    }
  ]
};
