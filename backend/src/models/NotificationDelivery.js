const mongoose = require('mongoose');
const NotificationDeliverySchema = new mongoose.Schema({
  alert: { type: mongoose.Schema.Types.ObjectId, ref: 'Alert', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deliveredAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('NotificationDelivery', NotificationDeliverySchema);
