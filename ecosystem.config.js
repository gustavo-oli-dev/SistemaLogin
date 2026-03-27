module.exports = {
  apps: [
    {
      name: "back-end",
      script: "python",
      args: "app.py",
      cwd: "./backend",
      watch: true,
      env: {
        NODE_ENV: "development",
      }
    },
    {
      name: "front-end",
      script: "npm",
      args: "start",
      cwd: "./frontend",
      shell: true,
      env: {
        NODE_ENV: "development",
      }
    }
  ]
};