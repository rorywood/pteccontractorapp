/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

declare const self: ServiceWorkerGlobalScope

// App version — bump this string to trigger update notifications
const APP_VERSION = '1.0.0'

// Take control immediately when activated
self.skipWaiting()
clientsClaim()

// Clean up old caches from previous versions
cleanupOutdatedCaches()

// Precache all assets injected by vite-plugin-pwa
precacheAndRoute(self.__WB_MANIFEST)

// Broadcast version info to all clients
self.addEventListener('message', (event) => {
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: APP_VERSION })
  }
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Notify clients when a new SW has installed
self.addEventListener('install', () => {
  // Broadcast to all clients that a new version is installing
  self.clients.matchAll({ type: 'window' }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: 'SW_INSTALLING', version: APP_VERSION })
    })
  })
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: 'SW_ACTIVATED', version: APP_VERSION })
      })
    })
  )
})
