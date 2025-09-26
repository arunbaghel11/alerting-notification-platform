const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export async function createAlert(data){
  const res = await fetch(API_BASE + '/admin/alerts', {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)
  });
  return res.json();
}

export async function listAlerts(){
  const res = await fetch(API_BASE + '/admin/alerts');
  return res.json();
}

export async function triggerReminders(){
  const res = await fetch(API_BASE + '/admin/trigger-reminders', { method:'POST' });
  return res.json();
}

export async function fetchUserAlerts(userId){
  const res = await fetch(API_BASE + '/user/' + userId + '/alerts');
  return res.json();
}

export async function snooze(userId, alertId){
  const res = await fetch(API_BASE + `/user/${userId}/alerts/${alertId}/snooze`, { method:'POST' });
  return res.json();
}

export async function markRead(userId, alertId){
  const res = await fetch(API_BASE + `/user/${userId}/alerts/${alertId}/read`, { method:'POST' });
  return res.json();
}
