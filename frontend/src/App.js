import React, { useEffect, useState } from 'react';
import { listAlerts, triggerReminders, fetchUserAlerts, snooze, markRead } from './api';

function AdminDashboard(){ 
  const [alerts, setAlerts] = useState([]);
  useEffect(()=>{ listAlerts().then(setAlerts); },[]);
  return (
    <div style={{padding:20}}>
      <h2>Admin - Alerts</h2>
      <button onClick={()=>triggerReminders().then(r=>alert('Triggered: '+r.triggered))}>Trigger Reminders (simulate)</button>
      <ul>
        {alerts.map(a=> <li key={a._id}><strong>{a.title}</strong> — {a.severity}</li>)}
      </ul>
    </div>
  );
}

function UserDashboard(){
  const [alerts, setAlerts] = useState([]);
  // default to first seeded user id placeholder - replace with real id after seeding
  const userId = window.prompt('Enter user id to view (seeded users created by seed script). Leave blank to skip.') || '';
  useEffect(()=>{ if(userId) fetchUserAlerts(userId).then(setAlerts); },[userId]);
  return (
    <div style={{padding:20}}>
      <h2>User Dashboard</h2>
      {userId ? (
        <ul>
          {alerts.map(item => {
            const { alert, preference, lastDelivery } = item;
            return (
              <li key={alert._id} style={{border:'1px solid #ddd', margin:8, padding:8}}>
                <h4>{alert.title} <small>({alert.severity})</small></h4>
                <p>{alert.message}</p>
                <div>Last delivered: {lastDelivery ? new Date(lastDelivery.deliveredAt).toLocaleString() : 'Not yet'}</div>
                <div>Read: {preference && preference.read ? 'Yes' : 'No'}</div>
                <button onClick={()=>markRead(userId, alert._id).then(()=>alert('Marked read'))}>Mark Read</button>
                <button onClick={()=>snooze(userId, alert._id).then(()=>alert('Snoozed for today'))}>Snooze for today</button>
              </li>
            )
          })}
        </ul>
      ) : <div>No user id provided.</div>}
    </div>
  );
}

export default function App(){
  return (
    <div style={{fontFamily:'Arial, sans-serif'}}>
      <h1>Alerting & Notification Platform (MVP)</h1>
      <div style={{display:'flex', gap:20}}>
        <AdminDashboard />
        <UserDashboard />
      </div>
    </div>
  );
}
