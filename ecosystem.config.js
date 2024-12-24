// ============== PM2 ECOSYSTEM FILE =================
// /srv/www/pm2/ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'rgci-client', // will be used to refer to app in pm2 commands.
      // it's convenient if it's the same as nginx location and folder name but not necessary
      cwd: 'client', // I prefer absolute paths for clarity but this can be a relative path
      script: 'yarn',
      args: 'preview',
      env_production: {
        NODE_ENV: 'production',
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
    {
      name: 'rgci-server',
      cwd: 'server',
      script: 'index.js',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}

// pm2 commands:
// $ pm2 ecosystem // generate sample file
// $ pm2 start/reload/restart/stop app-name
// $ pm2 logs app-name --lines 5000
// $ pm2 start ecosystem.config.js

// ============== ECOSYSTEM END =================
