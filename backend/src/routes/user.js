const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.get('/:userId/alerts', controller.fetchAlerts);
router.post('/:userId/alerts/:alertId/read', controller.markRead);
router.post('/:userId/alerts/:alertId/unread', controller.markUnread);
router.post('/:userId/alerts/:alertId/snooze', controller.snooze);

module.exports = router;
