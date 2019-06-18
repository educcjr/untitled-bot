module.exports = {
  apps: [{
    name: 'api',
    script: './api/index.js',
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }, {
    name: 'bot',
    script: './bot/index.js',
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }]
};
