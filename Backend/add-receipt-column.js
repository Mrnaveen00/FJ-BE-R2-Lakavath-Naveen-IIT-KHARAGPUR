// Quick script to add receipt_path column to production database
const db = require('./db');

async function addReceiptColumn() {
    try {
        console.log('Adding receipt_path column to transactions table...');
        
        await db.query(`
            ALTER TABLE transactions 
            ADD COLUMN IF NOT EXISTS receipt_path VARCHAR(255);
        `);
        
        console.log('✅ Column added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding column:', error);
        process.exit(1);
    }
}

addReceiptColumn();
