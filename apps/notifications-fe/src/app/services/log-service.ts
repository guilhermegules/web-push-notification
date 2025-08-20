function log(level: 'info' | 'error', message: string, meta?: any) {
  fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level, message, meta, ts: Date.now() }),
  });
}

window.addEventListener('error', (event) => {
  log('error', event.message, { stack: event.error?.stack });
});

window.addEventListener('unhandledrejection', (event) => {
  log('error', 'Unhandled promise rejection', { reason: event.reason });
});
