const Alert = require('../models/Alert');
const ReminderService = require('../services/reminderService');

exports.createAlert = async (req, res) => {
  try{
    const data = req.body;
    const alert = await Alert.create(data);
    return res.json(alert);
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updateAlert = async (req, res) => {
  try{
    const { id } = req.params;
    const data = req.body;
    const alert = await Alert.findByIdAndUpdate(id, data, { new: true });
    return res.json(alert);
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};

exports.listAlerts = async (req, res) => {
  try{
    const { severity, status, audience } = req.query;
    const q = {};
    if (severity) q.severity = severity;
    if (status === 'active') q.archived = false;
    if (status === 'expired') q.expiresAt = { $lte: new Date() };
    const alerts = await Alert.find(q).sort({ createdAt: -1 }).limit(200);
    return res.json(alerts);
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};

exports.triggerReminders = async (req, res) =>{
  try{
    const results = await ReminderService.triggerReminders();
    return res.json({ triggered: results.length, details: results });
  }catch(err){
    return res.status(500).json({ error: err.message });
  }
};
