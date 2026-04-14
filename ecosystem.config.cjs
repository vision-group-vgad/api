module.exports = {
  apps: [{
    name: 'vgad-api',
    script: './server.js',
    instances: 1,
    exec_mode: 'fork',
    
    // Environment variables
    env: {
      NODE_ENV: 'development',
      PORT: 4000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    
    // Performance and logging
    watch: false,
    ignore_watch: ['node_modules', 'logs', '*.log', 'data'],
    watch_delay: 1000,
    
    // Logging
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Process management
    max_memory_restart: '500M',
    autorestart: true,
    restart_delay: 4000,
    
    source_map_support: true,
    merge_logs: true
  }]
};
