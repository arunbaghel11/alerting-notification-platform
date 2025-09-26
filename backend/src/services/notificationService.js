/**
 * Strategy-like notification service.
 * For MVP only InApp is implemented.
 * To add Email/SMS implement new strategies and register here.
 */
const NotificationDelivery = require('../models/NotificationDelivery');

class InAppStrategy {
  async send(alert, user){
    // Create a delivery record - in a real system we would also publish to websockets or push services
    const nd = await NotificationDelivery.create({ alert: alert._id, user: user._id });
    console.log(`InApp: delivered alert(${alert.title}) to user(${user.name})`);
    return nd;
  }
}

const strategies = {
  InApp: new InAppStrategy()
};

module.exports = {
  async deliver(alert, user){
    for (const t of alert.deliveryTypes){
      const strat = strategies[t];
      if (strat) await strat.send(alert, user);
      else console.warn('No strategy for', t);
    }
  },
  // Expose for extension
  registerStrategy(name, impl){
    strategies[name] = impl;
  }
};
