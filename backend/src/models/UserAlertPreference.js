const mongoose = require('mongoose');
const UserAlertPreferenceSchema = new mongoose.Schema({
  alert: { type: mongoose.Schema.Types.ObjectId, ref: 'Alert', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  snoozedUntil: { type: Date, default: null },
  read: { type: Boolean, default: false }
}, { timestamps: true });
UserAlertPreferenceSchema.index({ alert:1, user:1 }, { unique: true });
module.exports = mongoose.model('UserAlertPreference', UserAlertPreferenceSchema);
