// ==========================================
// DATABASE CONFIGURATION CONSTANTS
// ==========================================

module.exports = {
  // Connection Pool Settings
  POOL_CONFIG: {
    MAX_CONNECTIONS: 20,
    MIN_CONNECTIONS: 5,
    IDLE_TIMEOUT: 30000,
    CONNECTION_TIMEOUT: 10000,
    MAX_USES: 7500,
  },
  
  // Query Timeout Settings
  QUERY_TIMEOUT: 30000, // 30 seconds
  
  // Transaction Settings
  TRANSACTION_TIMEOUT: 60000, // 60 seconds
  
  // Retry Settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};
