import { useState, useEffect, useCallback } from 'react'
import { applyUpdate } from '../utils/registerSW'

export function useServiceWorker() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      const { registration } = (e as CustomEvent).detail
      setRegistration(registration)
      setUpdateAvailable(true)
      setLastChecked(new Date())
    }
    window.addEventListener('swUpdateAvailable', handler)
    return () => window.removeEventListener('swUpdateAvailable', handler)
  }, [])

  const checkForUpdate = useCallback(async () => {
    setChecking(true)
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      if (reg) {
        await reg.update()
        setRegistration(reg)
      }
      setLastChecked(new Date())
    } catch (err) {
      console.warn('[SW] Manual update check failed:', err)
    } finally {
      setChecking(false)
    }
  }, [])

  const applyPendingUpdate = useCallback(() => {
    if (registration) {
      applyUpdate(registration)
    }
  }, [registration])

  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false)
  }, [])

  return {
    updateAvailable,
    lastChecked,
    checking,
    checkForUpdate,
    applyPendingUpdate,
    dismissUpdate,
  }
}
