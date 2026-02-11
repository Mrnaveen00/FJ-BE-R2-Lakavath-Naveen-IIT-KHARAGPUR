// ==========================================
// DATABASE CONNECTION POOL TEST
// Test the database connection pool
// ==========================================

const db = require('./db');

// ==========================================
// TEST CONNECTION POOL
// ==========================================
const testDatabasePool = async () => {
  console.log('\n========================================');
  console.log('🧪 TESTING DATABASE CONNECTION POOL');
  console.log('========================================\n');
  
  try {
    // 1. Test basic connection
    console.log('1️⃣  Testing basic connection...');
    const connected = await db.testConnection();
    
    if (!connected) {
      console.error('❌ Connection test failed!');
      process.exit(1);
    }
    
    // 2. Test query execution
    console.log('\n2️⃣  Testing query execution...');
    const queryResult = await db.query('SELECT current_database(), current_user');
    console.log('✅ Query successful!');
    console.log('   Database:', queryResult.rows[0].current_database);
    console.log('   User:', queryResult.rows[0].current_user);
    
    // 3. Test pool status
    console.log('\n3️⃣  Checking pool status...');
    const poolStatus = db.getPoolStatus();
    console.log('✅ Pool Status:');
    console.log('   Total connections:', poolStatus.total);
    console.log('   Idle connections:', poolStatus.idle);
    console.log('   Waiting requests:', poolStatus.waiting);
    
    // 4. Test health check
    console.log('\n4️⃣  Running health check...');
    const health = await db.healthCheck();
    console.log('✅ Health Check:', health);
    
    // 5. Test multiple concurrent queries
    console.log('\n5️⃣  Testing concurrent queries...');
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(db.query('SELECT $1 as query_number', [i + 1]));
    }
    await Promise.all(promises);
    console.log('✅ All 5 concurrent queries completed!');
    
    // 6. Test transaction
    console.log('\n6️⃣  Testing transaction...');
    await db.transaction(async (client) => {
      await client.query('SELECT 1');
      await client.query('SELECT 2');
      await client.query('SELECT 3');
    });
    console.log('✅ Transaction completed successfully!');
    
    console.log('\n========================================');
    console.log('✅ ALL TESTS PASSED!');
    console.log('========================================\n');
    
    // Close pool
    await db.closePool();
    console.log('👋 Test completed. Pool closed.\n');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('Stack:', error.stack);
    await db.closePool();
    process.exit(1);
  }
};

// Run tests if executed directly
if (require.main === module) {
  testDatabasePool();
}

module.exports = testDatabasePool;
