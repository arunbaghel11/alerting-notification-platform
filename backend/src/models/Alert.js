const mongoose = require('mongoose');
const AlertSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ['Info','Warning','Critical'], default: 'Info' },
  deliveryTypes: { type: [String], default: ['InApp'] }, // extensible
  startAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  reminderEnabled: { type: Boolean, default: true },
  reminderFrequencyMinutes: { type: Number, default: 120 }, // default 2 hours
  visibility: {
    org: { type: Boolean, default: true },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  archived: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Alert', AlertSchema);
