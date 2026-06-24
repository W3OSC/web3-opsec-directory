module.exports = {
  apps: [
    {
      name: "w3os-frontend-local",
      script: "npm",
      args: "run dev -- -p 3100",
      cwd: "./frontend",
      env: {
        NEXT_PUBLIC_API_URL: "http://localhost:3101",
      },
    },
    {
      name: "w3os-backend-local",
      script: "bun",
      args: "run dev",
      cwd: "./backend",
      env_file: "./secrets/.env.backend.local",
      env: {
        PORT: "3101",
        CORS_ORIGIN: "http://localhost:3100",
      },
    },
  ],
};
