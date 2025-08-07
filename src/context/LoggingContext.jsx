import React from 'react';

// Placeholder for custom logging context

// Logging context for the app
export const LoggingContext = React.createContext({
  log: (event, data) => {},
});

export const LoggingProvider = ({ children }) => {
  // Log events to localStorage (or send to server, etc.)
  const log = (event, data) => {
    const logs = JSON.parse(localStorage.getItem('appLogs') || '[]');
    logs.push({
      event,
      data,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('appLogs', JSON.stringify(logs));
  };

  return (
    <LoggingContext.Provider value={{ log }}>
      {children}
    </LoggingContext.Provider>
  );
};
