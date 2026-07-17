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
