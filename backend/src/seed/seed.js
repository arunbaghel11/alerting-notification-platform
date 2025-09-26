/**
 * Seed script to create sample teams, users and alerts.
 * Run: node src/seed/seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Team = require('../models/Team');
const User = require('../models/User');
const Alert = require('../models/Alert');

async function seed(){
  await connectDB();
  await Team.deleteMany({});
  await User.deleteMany({});
  await Alert.deleteMany({});

  const eng = await Team.create({ name: 'Engineering' });
  const mkt = await Team.create({ name: 'Marketing' });

  const alice = await User.create({ name: 'Alice', email: 'alice@example.com', team: eng._id });
  const bob = await User.create({ name: 'Bob', email: 'bob@example.com', team: mkt._id });
  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', isAdmin: true });

  await Alert.create({
    title: 'Scheduled Maintenance',
    message: 'Platform will have scheduled maintenance tonight.',
    severity: 'Warning',
    visibility: { org: false, teams: [eng._id], users: [] },
    reminderEnabled: true,
    startAt: new Date(),
    expiresAt: null
  });

  await Alert.create({
    title: 'Policy Update',
    message: 'New privacy policy updated. Please review.',
    severity: 'Info',
    visibility: { org: true, teams: [], users: [] },
    reminderEnabled: true
  });

  console.log('Seed complete. Users:', [alice.name, bob.name, admin.name]);
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
