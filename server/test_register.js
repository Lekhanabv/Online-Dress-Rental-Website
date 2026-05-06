const bcrypt = require('bcryptjs');
const pool = require('./config/db');
(async () => {
  try {
    const name='Test User';
    const email='testuser@example.com';
    const password='Test1234';
    const role='customer';
    const userRole = role === 'vendor' ? 'vendor' : 'customer';
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    console.log('existing', existing.length);
    if (existing.length) {
      console.log('Email exists');
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, userRole]);
    console.log('insertId', result.insertId);
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: result.insertId, email, role: userRole }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('token', token.slice(0,20));
  } catch (e) {
    console.error('ERROR', e);
    process.exit(1);
  }
})();
