module.exports = {
  apps: [
    {
      name: 'winst-admin',
      script: 'npx',
      args: ['serve', '-s', 'dist', '-p', process.env.ADMIN_PORT || '5174'],
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production'
      },
      error_file: '../logs/admin-error.log',
      out_file: '../logs/admin-out.log',
      log_file: '../logs/admin-combined.log'
    }
  ]
};
