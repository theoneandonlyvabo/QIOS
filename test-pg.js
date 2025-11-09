const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'qios_web',
  password: 'vano12345678',
  port: 5432,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL!');
    const res = await client.query('SELECT NOW()');
    console.log('Current time in DB:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error:', err);
  }
}

testConnection();