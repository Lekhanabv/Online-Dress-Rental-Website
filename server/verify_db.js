const mysql = require("mysql2/promise");
require('dotenv').config();
(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const [tables] = await conn.query("SHOW TABLES LIKE 'users'");
    console.log('TABLES', tables.length);
    const [users] = await conn.query('SELECT COUNT(*) AS c FROM users');
    console.log('USER COUNT', users[0].c);
    await conn.end();
  } catch (e) {
    console.error('ERR', e.message);
    process.exit(1);
  }
})();
