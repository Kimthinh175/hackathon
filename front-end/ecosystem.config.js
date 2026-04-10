module.exports = {
  apps: [
    {
      name: 'waremax-dashboard',
      script: 'npm',
      args: 'start',
      cwd: './',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
