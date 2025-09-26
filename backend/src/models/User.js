const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
