// sw.js - Service Worker para notificaciones push
const CACHE_NAME = 'alacancha-v1';

// Instalar service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado');
  self.skipWaiting();
});

// Activar service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
  event.waitUntil(clients.claim());
});

// Escuchar notificaciones push
self.addEventListener('push', (event) => {
  console.log('Push recibido:', event);

  let notificationData = {
    title: '⚽ A la Cancha',
    body: 'Nueva notificación',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      console.error('Error parseando datos push:', e);
    }
  }

  const promiseChain = self.registration.showNotification(
    notificationData.title,
    {
      body: notificationData.body,
      icon: notificationData.icon || '/icon-192.png',
      badge: notificationData.badge || '/badge-72.png',
      vibrate: notificationData.vibrate || [200, 100, 200],
      data: notificationData.data,
      actions: [
        {
          action: 'view',
          title: 'Ver cupo',
          icon: '/icon-view.png'
        },
        {
          action: 'close',
          title: 'Cerrar',
          icon: '/icon-close.png'
        }
      ],
      requireInteraction: false,
      tag: 'alacancha-notification'
    }
  );

  event.waitUntil(promiseChain);
});

// Manejar click en notificación
self.addEventListener('notificationclick', (event) => {
  console.log('Notificación clickeada:', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Si hay URL en los datos, abrir esa página
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Si ya hay una ventana abierta, enfocarla
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abrir nueva ventana
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Manejar cierre de notificación
self.addEventListener('notificationclose', (event) => {
  console.log('Notificación cerrada:', event);
});