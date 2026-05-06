const express = require('express');
const authenticate = require('../middleware/auth');
const { getProfile } = require('../controllers/customerController');
const router = express.Router();

router.get('/profile', authenticate, getProfile);

module.exports = router;


