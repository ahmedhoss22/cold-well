module.exports = {
  apps: [
    {
      name: "coldwell-server",
      script: "./src/server.js",
      args: "start -p 9001",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
