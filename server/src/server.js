const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/db');
const { verifySmtpConnection } = require('./utils/emailService');

const startServer = async () => {
  // Bind port immediately so cloud providers (Render, Railway) detect the open port right away
  const server = app.listen(config.port, () => {
    console.log('--------------------------------------------------');
    console.log(` MatruCare AI Hackathon 2026 Server Running`);
    console.log(` Port: ${config.port}`);
    console.log(` Environment: ${config.nodeEnv}`);
    console.log(` Client Origin: ${config.clientUrl}`);
    console.log('--------------------------------------------------');
  });

  try {
    // Connect to MongoDB
    await connectDB();
  } catch (error) {
    console.error(`[Database Warning] Initial connection failed: ${error.message}`);
    console.error(`[Database Help] Ensure '0.0.0.0/0' is added to MongoDB Atlas > Network Access whitelist.`);
  }

  try {
    // Verify SMTP connection status
    const smtpStatus = await verifySmtpConnection();
    console.log(`[Email Service Status]: ${smtpStatus.message}`);
  } catch (err) {
    console.warn(`[Email Service Warning]: ${err.message}`);
  }

  // Graceful shutdown handling
  const shutdown = (signal) => {
    console.log(`\n[Process] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('[Process] Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer();
