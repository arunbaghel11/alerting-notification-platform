const express = require('express');
const router = express.Router();
const controller = require('../controllers/alertController');

router.post('/alerts', controller.createAlert);
router.put('/alerts/:id', controller.updateAlert);
router.get('/alerts', controller.listAlerts);

// demo endpoint to trigger reminders (simulate cron)
router.post('/trigger-reminders', controller.triggerReminders);

module.exports = router;
