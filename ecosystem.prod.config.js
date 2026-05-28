module.exports = {
  apps: [
    {
      name: "w3os-frontend",
      script: "node",
      args: ".next/standalone/frontend/server.js",
      cwd: "/var/www/w3os/frontend",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_file: "/var/www/w3os/secrets/.env.frontend.prod",
    },
    {
      name: "w3os-backend",
      script: "bun",
      args: "run src/index.ts",
      cwd: "/var/www/w3os/backend",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      env_file: "/var/www/w3os/secrets/.env.backend.prod",
    },
  ],
};
