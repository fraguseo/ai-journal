// Basic service worker for notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/logo192.png',
    badge: '/logo192.png'
  };
  
  event.waitUntil(
    self.registration.showNotification('Goal Reminder', options)
  );
}); 