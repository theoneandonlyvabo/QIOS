const pool = require('./database');

async function testConnection() {
    try {
    const client = await pool.connect();
    // console.log('Successfully connected to PostgreSQL');
        
    // Test query
    const result = await client.query('SELECT NOW()');
    // console.log('Database time:', result.rows[0].now);
        
        client.release();
    } catch (err) {
        console.error('Database connection error:', err);
    } finally {
        // Optional: close pool
        // await pool.end();
    }
}

testConnection();