// ==========================================
// DATABASE CONNECTION POOL
// PostgreSQL connection pool configuration
// ==========================================

const { Pool } = require('pg');
require('dotenv').config();

// ==========================================
// CONNECTION POOL CONFIGURATION
// ==========================================
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'finance_tracker',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  
  // Pool settings
  max: 20,                    // Maximum number of clients in the pool
  min: 5,                     // Minimum number of clients in the pool
  idleTimeoutMillis: 30000,   // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return error after 10 seconds if connection not available
  maxUses: 7500,              // Close (and replace) a connection after it has been used this many times
  
  // Connection retry settings
  allowExitOnIdle: false,     // Don't exit on idle connections
  
  // SSL configuration (uncomment for production)
  // ssl: {
  //   rejectUnauthorized: false,
  // },
};

// ==========================================
// CREATE CONNECTION POOL
// ==========================================
const pool = new Pool(poolConfig);

// ==========================================
// POOL EVENT HANDLERS
// ==========================================

// Handle pool errors
pool.on('error', (err, client) => {
  console.error('❌ Unexpected error on idle client:', err.message);
  console.error('Stack:', err.stack);
});

// Handle new client connections
pool.on('connect', (client) => {
  console.log('🔗 New client connected to the pool');
});

// Handle client acquisition
pool.on('acquire', (client) => {
  console.log('📌 Client acquired from pool');
});

// Handle client release
pool.on('remove', (client) => {
  console.log('🔌 Client removed from pool');
});

// ==========================================
// TEST DATABASE CONNECTION
// ==========================================
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    
    console.log('✅ Database connection successful!');
    console.log(`📅 Server Time: ${result.rows[0].current_time}`);
    console.log(`🗄️  PostgreSQL Version: ${result.rows[0].postgres_version.split(',')[0]}`);
    console.log(`🏊 Pool Status: ${pool.totalCount} total, ${pool.idleCount} idle, ${pool.waitingCount} waiting`);
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Stack:', error.stack);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// ==========================================
// QUERY WRAPPER - Execute queries with pool
// ==========================================
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`📊 Query executed in ${duration}ms`);
    return result;
  } catch (error) {
    console.error('❌ Query error:', error.message);
    console.error('Query:', text);
    console.error('Params:', params);
    throw error;
  }
};

// ==========================================
// TRANSACTION WRAPPER - Execute queries in transaction
// ==========================================
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Transaction rolled back:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

// ==========================================
// GET POOL STATUS
// ==========================================
const getPoolStatus = () => {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  };
};

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================
const closePool = async () => {
  try {
    await pool.end();
    console.log('👋 Database pool closed gracefully');
  } catch (error) {
    console.error('❌ Error closing pool:', error.message);
    throw error;
  }
};

// ==========================================
// HEALTH CHECK
// ==========================================
const healthCheck = async () => {
  try {
    const result = await query('SELECT 1 as health');
    return {
      status: 'healthy',
      database: 'connected',
      pool: getPoolStatus(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
    };
  }
};

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  pool,
  query,
  transaction,
  testConnection,
  getPoolStatus,
  closePool,
  healthCheck,
};
