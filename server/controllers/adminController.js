const pool = require('../config/db');

const getTables = async (req, res) => {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    const tables = rows.map((row) => Object.values(row)[0]);
    res.json({ tables });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load database tables' });
  }
};

const getTableData = async (req, res) => {
  try {
    const tableName = req.params.tableName;
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    const [rows] = await pool.query('SELECT * FROM ?? LIMIT 20', [tableName]);
    res.json({ table: tableName, rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load table data' });
  }
};

module.exports = { getTables, getTableData };


