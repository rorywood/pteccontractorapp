// Service Worker registration and update management

export function registerSW() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[SW] Registered:', registration.scope)

          // Poll for updates every 60 seconds
          setInterval(() => {
            registration.update().catch(() => {})
          }, 60_000)

          // Detect when a new SW is waiting
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (!newWorker) return

            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New version ready — dispatch event for UI to pick up
                window.dispatchEvent(new CustomEvent('swUpdateAvailable', {
                  detail: { registration },
                }))
              }
            })
          })
        })
        .catch((err) => {
          console.error('[SW] Registration failed:', err)
        })

      // Handle controller change (after skipWaiting) → reload
      let refreshing = false
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true
          window.location.reload()
        }
      })
    })
  }
}

// Trigger the waiting SW to take over
export function applyUpdate(registration: ServiceWorkerRegistration) {
  const waitingWorker = registration.waiting
  if (waitingWorker) {
    waitingWorker.postMessage({ type: 'SKIP_WAITING' })
  }
}
