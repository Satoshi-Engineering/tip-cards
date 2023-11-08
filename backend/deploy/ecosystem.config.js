module.exports = {
  // PM2 Run Configuration
  apps: [
    {
      name: 'lightning-tip-cards-backend',
      script: './dist/backend/index.js',
      node_args: '-r tsconfig-paths/register',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
