module.exports = {
  apps: [
    {
      name: "w3os-frontend-local",
      script: "npm",
      args: "run dev -- -p 3000",
      cwd: "./frontend",
      env: {
        NEXT_PUBLIC_API_URL: "http://localhost:3001",
      },
    },
    {
      name: "w3os-backend-local",
      script: "bun",
      args: "run dev",
      cwd: "./backend",
      env_file: "./secrets/.env.backend.local",
      env: {
        PORT: "3001",
        CORS_ORIGIN: "http://nuc:3113",
      },
    },
  ],
};
