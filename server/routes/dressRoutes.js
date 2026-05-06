const express = require('express');
const { listDresses, getDress } = require('../controllers/dressController');
const router = express.Router();

router.get('/', listDresses);
router.get('/:id', getDress);

module.exports = router;


