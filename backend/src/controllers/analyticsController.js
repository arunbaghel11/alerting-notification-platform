const Alert = require('../models/Alert');
const NotificationDelivery = require('../models/NotificationDelivery');

exports.summary = async (req, res) => {
  try{
    const totalAlerts = await Alert.countDocuments();
    const delivered = await NotificationDelivery.countDocuments();
    const read = await NotificationDelivery.countDocuments({ read:true });
    const snoozedAgg = await require('../models/UserAlertPreference').aggregate([
      { $match: { snoozedUntil: { $ne: null } } },
      { $group: { _id: '$alert', snoozedCount: { $sum: 1 } } }
    ]);
    const bySeverity = await Alert.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    return res.json({ totalAlerts, delivered, read, snoozedAgg, bySeverity });
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};
