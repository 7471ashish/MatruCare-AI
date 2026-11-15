const mongoose = require('mongoose');
const config = require('./env');

/**
 * Connect to MongoDB database
 * @param {string} [customUri] - Optional custom URI for tests or override
 * @returns {Promise<typeof mongoose>}
 */
const connectDB = async (customUri) => {
  const uri = customUri || config.mongoUri;
  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
    });
    console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    // If not in test environment, allow caller to handle or rethrow
    throw error;
  }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('[Database] MongoDB disconnected successfully');
  } catch (error) {
    console.error(`[Database Error] Disconnection error: ${error.message}`);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
};

