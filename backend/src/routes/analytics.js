const express = require('express');
const router = express.Router();
const controller = require('../controllers/analyticsController');

router.get('/summary', controller.summary);

module.exports = router;
