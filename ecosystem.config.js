module.exports = {
  apps: [
    {
      name: 'waremax-dashboard',
      script: 'npm',
      args: 'run start',
      cwd: 'front-end',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
