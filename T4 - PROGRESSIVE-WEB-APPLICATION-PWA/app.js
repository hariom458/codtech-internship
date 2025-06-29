// Register the Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ ServiceWorker registration successful:', registration);
      })
      .catch(error => {
        console.log('❌ ServiceWorker registration failed:', error);
      });
  });
}

// Handle Notification Button
const notificationsBtn = document.getElementById('notifications-btn');

notificationsBtn.addEventListener('click', () => {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('✅ Notification permission granted.');
            // (Optional) Here you would get the subscription and send it to your backend
            alert('Notifications have been enabled!');
        } else {
            console.log('❌ Notification permission denied.');
            alert('You have denied notifications.');
        }
    });
});