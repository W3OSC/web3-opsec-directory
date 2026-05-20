module.exports = {
  apps: [
    {
      name: "w3os-frontend-local",
      script: "npm",
      args: "run dev",
      cwd: "./frontend",
    },
    {
      name: "w3os-backend-local",
      script: "bun",
      args: "run dev",
      cwd: "./backend",
      env_file: "./secrets/.env.backend.local",
    },
  ],
};
