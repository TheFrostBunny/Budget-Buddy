if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                const updateNotification = document.createElement('div');
                updateNotification.style.position = 'fixed';
                updateNotification.style.bottom = '20px';
                updateNotification.style.right = '20px';
                updateNotification.style.backgroundColor = '#333';
                updateNotification.style.color = '#fff';
                updateNotification.style.padding = '10px';
                updateNotification.style.borderRadius = '5px';
                updateNotification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                updateNotification.innerText =
                  'En ny versjon er tilgjengelig. Klikk for å oppdatere!';
                updateNotification.style.cursor = 'pointer';

                updateNotification.addEventListener('click', () => {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                });

                document.body.appendChild(updateNotification);
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}
