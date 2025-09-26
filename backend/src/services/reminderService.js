/**
 * Reminder service: finds active alerts and delivers to eligible users
 * until user has snoozed for today or alert expired.
 * Exposes a triggerReminders() for demo/simulation (admin endpoint).
 */
const Alert = require('../models/Alert');
const User = require('../models/User');
const UserAlertPreference = require('../models/UserAlertPreference');
const NotificationDelivery = require('../models/NotificationDelivery');
const notificationService = require('./notificationService');

function isExpired(alert){
  return alert.expiresAt && (new Date(alert.expiresAt) < new Date());
}

async function userEligibleForAlert(user, alert){
  // visibility checks
  if (alert.archived) return false;
  if (isExpired(alert)) return false;
  const now = new Date();
  if (alert.startAt && (new Date(alert.startAt) > now)) return false;
  if (alert.visibility.org) return true;
  if (alert.visibility.users && alert.visibility.users.some(u => String(u) === String(user._id))) return true;
  if (alert.visibility.teams && user.team && alert.visibility.teams.some(t => String(t) === String(user.team))) return true;
  return false;
}

function isSnoozedForToday(pref){
  if (!pref || !pref.snoozedUntil) return false;
  const now = new Date();
  return new Date(pref.snoozedUntil) > now;
}

module.exports = {
  // trigger reminders: find active alerts, for each user deliver if eligible and not snoozed
  async triggerReminders(){
    const alerts = await Alert.find({ archived:false, reminderEnabled:true })
      .populate('visibility.users visibility.teams');
    const users = await User.find();
    const results = [];
    for (const alert of alerts){
      if (isExpired(alert)) continue;
      for (const user of users){
        if (!await userEligibleForAlert(user, alert)) continue;
        // fetch preference
        const pref = await UserAlertPreference.findOne({ alert: alert._id, user: user._id });
        if (isSnoozedForToday(pref)) {
          // skip - user snoozed for the day
          continue;
        }
        // deliver and create delivery record
        const nd = await notificationService.deliver(alert, user);
        results.push({ alert: alert.title, user: user.name, deliveredAt: new Date() });
      }
    }
    return results;
  }
};
