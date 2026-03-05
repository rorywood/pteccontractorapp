import { useState, useEffect, useCallback } from 'react'

export const CURRENT_VERSION = '1.0.1'
const UPDATE_SERVER = 'https://pteccontractorapp.pages.dev'

export interface UpdateInfo {
  version: string
  apkUrl: string
  releaseNotes: string
}

export type CheckResult = 'up-to-date' | 'update-available' | 'offline' | 'error' | null

export function useAppUpdater() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [checking, setChecking] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [checkResult, setCheckResult] = useState<CheckResult>(null)

  const checkForUpdate = useCallback(async (): Promise<CheckResult> => {
    setChecking(true)
    setCheckResult(null)
    try {
      const res = await fetch(`${UPDATE_SERVER}/version.json?t=${Date.now()}`, {
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) {
        setCheckResult('error')
        return 'error'
      }
      const data: UpdateInfo = await res.json()
      setLastChecked(new Date())
      if (data.version !== CURRENT_VERSION) {
        setUpdateInfo(data)
        setDismissed(false)
        setCheckResult('update-available')
        return 'update-available'
      } else {
        setCheckResult('up-to-date')
        return 'up-to-date'
      }
    } catch (e) {
      const isOffline = !navigator.onLine || (e instanceof Error && e.name === 'TimeoutError')
      const result: CheckResult = isOffline ? 'offline' : 'error'
      setCheckResult(result)
      return result
    } finally {
      setChecking(false)
    }
  }, [])

  // Check on launch and every 5 minutes (silent — no status shown for background checks)
  useEffect(() => {
    checkForUpdate()
    const interval = setInterval(checkForUpdate, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [checkForUpdate])

  return {
    updateAvailable: !!updateInfo && !dismissed,
    updateInfo,
    checking,
    checkResult,
    lastChecked,
    checkForUpdate,
    dismiss: () => setDismissed(true),
  }
}
