const express = require('express');
const authenticate = require('../middleware/auth');
const { getTables, getTableData } = require('../controllers/adminController');
const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

router.use(authenticate, requireAdmin);
router.get('/tables', getTables);
router.get('/tables/:tableName', getTableData);

module.exports = router;


