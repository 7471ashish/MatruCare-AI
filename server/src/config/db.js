const dns = require('dns');
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
    console.log(`[Database] MongoDB connected: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (error) {
    // Handle Windows/ISP DNS SRV resolution issue (querySrv ECONNREFUSED)
    if (uri.startsWith('mongodb+srv://') && error.message.includes('querySrv')) {
      console.warn('[Database] Local DNS failed on SRV lookup. Retrying with Google/Cloudflare DNS...');
      try {
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const conn = await mongoose.connect(uri, { autoIndex: true });
        console.log(`[Database] MongoDB connected via fallback DNS: ${conn.connection.host} (${conn.connection.name})`);
        return conn;
      } catch (retryError) {
        console.error(`[Database Error] Connection failed after DNS retry: ${retryError.message}`);
        throw retryError;
      }
    }

    console.error(`[Database Error] Connection failed: ${error.message}`);
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
