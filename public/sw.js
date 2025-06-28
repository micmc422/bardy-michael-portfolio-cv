'use strict'

self?.addEventListener('push', function (event) {
    if (event.data) {
        let data;
        try {
            data = event.data.json(); // Essayer de parser comme JSON
        } catch (e) {
            // Si ce n'est pas du JSON, essayez de le lire comme du texte brut
            console.warn('Push data is not JSON, treating as plain text.');
            data = {
                title: 'Notification', // Titre par défaut
                body: event.data.text(), // Le contenu est le texte brut
                icon: '/images/apple-icon-180x180.png', // Icône par défaut
            };
        }

        const options = {
            body: data.body,
            icon: data.icon || '/images/apple-icon-180x180.png',
            badge: '/images/apple-icon-180x180.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: '2',
            },
        }
        event.waitUntil(self.registration.showNotification(data.title, options)) // Utiliser data.title ici
    }
})

self?.addEventListener('notificationclick', function (event) {
    console.log('Notification click received.')
    event.notification.close()
    event.waitUntil(clients.openWindow('https://occitaweb-git-pwa-occitaweb.vercel.app'))
})