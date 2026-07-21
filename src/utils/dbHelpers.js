// Lightweight database helper functions to decouple main bundle from static course data

export const getDbItem = (key, defaultVal) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

export const setDbItem = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(e);
  }
};

export const logUserAccess = (email, name, action) => {
  try {
    const logs = getDbItem('beyondskills_access_logs', []);
    const newLog = {
      id: `LOG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      email: email || 'Unknown',
      name: name || 'Guest',
      action: action,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    logs.unshift(newLog);
    if (logs.length > 200) logs.pop();
    setDbItem('beyondskills_access_logs', logs);
  } catch (e) {
    console.error('Failed to log user access:', e);
  }
};

export const getISTDateTimeString = (dateVal = new Date()) => {
  if (!dateVal) return '';
  const d = typeof dateVal === 'number' || typeof dateVal === 'string' ? new Date(dateVal) : dateVal;
  if (isNaN(d.getTime())) {
    return String(dateVal);
  }
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  }).format(d);
};

