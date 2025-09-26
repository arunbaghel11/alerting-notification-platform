const Alert = require('../models/Alert');
const User = require('../models/User');
const UserAlertPreference = require('../models/UserAlertPreference');
const NotificationDelivery = require('../models/NotificationDelivery');

// helper: find alerts visible to user
async function findVisibleAlerts(user){
  const now = new Date();
  const alerts = await Alert.find({ archived:false, $or: [
    { 'visibility.org': true },
    { 'visibility.users': user._id },
    { 'visibility.teams': user.team }
  ]}).sort({ createdAt: -1 });
  return alerts.filter(alert => {
    if (alert.expiresAt && new Date(alert.expiresAt) < now) return false;
    if (alert.startAt && new Date(alert.startAt) > now) return false;
    return true;
  });
}

exports.fetchAlerts = async (req, res) => {
  try{
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const alerts = await findVisibleAlerts(user);
    // enrich with user preference and delivery/read info
    const enriched = await Promise.all(alerts.map(async alert => {
      const pref = await UserAlertPreference.findOne({ alert: alert._id, user: user._id });
      const lastDelivery = await NotificationDelivery.findOne({ alert: alert._id, user: user._id }).sort({ createdAt: -1 });
      return {
        alert,
        preference: pref || null,
        lastDelivery: lastDelivery || null
      };
    }));
    return res.json(enriched);
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};

exports.markRead = async (req, res) => {
  try{
    const { userId, alertId } = req.params;
    let pref = await UserAlertPreference.findOne({ alert: alertId, user: userId });
    if (!pref) pref = await UserAlertPreference.create({ alert: alertId, user: userId, read:true });
    pref.read = true;
    await pref.save();
    // mark last delivery record as read if exists
    const nd = await NotificationDelivery.findOne({ alert: alertId, user: userId }).sort({ createdAt:-1 });
    if (nd){ nd.read = true; await nd.save(); }
    return res.json({ success: true });
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};

exports.markUnread = async (req, res) => {
  try{
    const { userId, alertId } = req.params;
    let pref = await UserAlertPreference.findOne({ alert: alertId, user: userId });
    if (!pref) pref = await UserAlertPreference.create({ alert: alertId, user: userId, read:false });
    pref.read = false;
    await pref.save();
    return res.json({ success: true });
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};

exports.snooze = async (req, res) => {
  try{
    const { userId, alertId } = req.params;
    // snooze until midnight of today (end of day)
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0, 0, 0);
    let pref = await UserAlertPreference.findOne({ alert: alertId, user: userId });
    if (!pref) pref = await UserAlertPreference.create({ alert: alertId, user: userId });
    pref.snoozedUntil = endOfDay;
    await pref.save();
    return res.json({ success: true, snoozedUntil: endOfDay });
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};
