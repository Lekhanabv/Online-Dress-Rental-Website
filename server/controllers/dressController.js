const pool = require('../config/db');

const listDresses = async (req, res) => {
  try {
    const [dresses] = await pool.query('SELECT * FROM dresses WHERE available = 1');
    res.json(dresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load dresses' });
  }
};

const getDress = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM dresses WHERE id = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Dress not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load dress' });
  }
};

module.exports = { listDresses, getDress };


