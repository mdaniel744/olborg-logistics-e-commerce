module.exports = {
  apps: [
    {
      name: "olborg",
      script: "node_modules/.bin/next",
      args: "start --hostname 127.0.0.1 -p 3010",
      cwd: "/var/www/olborg",
      env: { NODE_ENV: "production" },
    },
    {
      name: "olborg-webhook",
      script: "scripts/deploy-webhook.cjs",
      cwd: "/var/www/olborg",
    },
  ],
};
