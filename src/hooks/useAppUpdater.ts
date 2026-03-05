import { useState, useEffect, useCallback } from 'react'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { FileOpener } from '@capawesome-team/capacitor-file-opener'

export const CURRENT_VERSION = '1.0.3'
const UPDATE_SERVER = 'https://pteccontractorapp.pages.dev'

export interface UpdateInfo {
  version: string
  apkUrl: string
  releaseNotes: string
}

export type CheckResult = 'up-to-date' | 'update-available' | 'offline' | 'error' | null
export type DownloadState = 'idle' | 'downloading' | 'ready' | 'error'

export function useAppUpdater() {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [checking, setChecking] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [checkResult, setCheckResult] = useState<CheckResult>(null)
  const [downloadState, setDownloadState] = useState<DownloadState>('idle')
  const [downloadProgress, setDownloadProgress] = useState(0)

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

  const downloadAndInstall = useCallback(async () => {
    if (!updateInfo) return
    setDownloadState('downloading')
    setDownloadProgress(0)

    try {
      // Download the APK via fetch with progress tracking
      const response = await fetch(updateInfo.apkUrl)
      if (!response.ok) throw new Error('Download failed')

      const contentLength = response.headers.get('Content-Length')
      const total = contentLength ? parseInt(contentLength, 10) : 0
      const reader = response.body!.getReader()
      const chunks: Uint8Array[] = []
      let received = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        received += value.length
        if (total > 0) setDownloadProgress(Math.round((received / total) * 100))
      }

      // Combine chunks into base64
      const allBytes = new Uint8Array(received)
      let offset = 0
      for (const chunk of chunks) {
        allBytes.set(chunk, offset)
        offset += chunk.length
      }

      // Convert to base64
      let binary = ''
      const chunkSize = 8192
      for (let i = 0; i < allBytes.length; i += chunkSize) {
        binary += String.fromCharCode(...allBytes.slice(i, i + chunkSize))
      }
      const base64 = btoa(binary)

      // Write APK to device storage
      const fileName = `powertec-update-${updateInfo.version}.apk`
      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Cache,
      })

      setDownloadProgress(100)
      setDownloadState('ready')

      // Trigger Android package installer
      await FileOpener.openFile({
        path: result.uri,
        mimeType: 'application/vnd.android.package-archive',
      })
    } catch (e) {
      console.error('APK download/install error:', e)
      setDownloadState('error')
    }
  }, [updateInfo])

  // Check on launch and every 5 minutes
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
    downloadAndInstall,
    downloadState,
    downloadProgress,
  }
}
