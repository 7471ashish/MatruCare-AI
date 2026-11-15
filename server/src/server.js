const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/db');
const { verifySmtpConnection } = require('./utils/emailService');

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Verify SMTP connection status
    const smtpStatus = await verifySmtpConnection();
    console.log(`[Email Service Status]: ${smtpStatus.message}`);

    // Listen on PORT
    const server = app.listen(config.port, () => {
      console.log('--------------------------------------------------');
      console.log(` MatruCare AI Hackathon 2026 Server Running`);
      console.log(` URL: http://localhost:${config.port}`);
      console.log(` Environment: ${config.nodeEnv}`);
      console.log(` Client Origin: ${config.clientUrl}`);
      console.log('--------------------------------------------------');
    });

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
  } catch (error) {
    console.error(`[Server Start Error]: ${error.message}`);
    process.exit(1);
  }
};

startServer();

