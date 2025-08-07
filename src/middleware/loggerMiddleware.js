

const LOG_KEY = 'appLogs';

export function logEvent(level, message, meta = {}) {
  const logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
  logs.push({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta
  });
  localStorage.setItem(LOG_KEY, JSON.stringify(logs));
}

export function getLogs() {
  return JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
}

export function clearLogs() {
  localStorage.removeItem(LOG_KEY);
}
