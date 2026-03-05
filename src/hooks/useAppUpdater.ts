import { useState, useEffect, useCallback } from 'react'
import { Filesystem, Directory } from '@capacitor/filesystem'
import { FileTransfer } from '@capacitor/file-transfer'
import { FileOpener } from '@capawesome-team/capacitor-file-opener'

export const CURRENT_VERSION = '1.0.7'
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

    // Progress listener handle for cleanup
    let progressHandle: Awaited<ReturnType<typeof FileTransfer.addListener>> | null = null

    try {
      const fileName = `powertec-update-${updateInfo.version}.apk`

      // Resolve the absolute path for the download target
      const { uri: fileUri } = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Cache,
      })
      // FileTransfer expects a filesystem path, not a file:// URI
      const absolutePath = fileUri.replace(/^file:\/\//, '')

      // Listen for native download progress
      progressHandle = await FileTransfer.addListener('progress', (p) => {
        if (p.type === 'download' && p.lengthComputable && p.contentLength > 0) {
          setDownloadProgress(Math.round((p.bytes / p.contentLength) * 100))
        }
      })

      // Native download — no JS bridge memory limits
      const result = await FileTransfer.downloadFile({
        url: updateInfo.apkUrl,
        path: absolutePath,
        progress: true,
        readTimeout: 120_000,
        connectTimeout: 30_000,
      })

      setDownloadProgress(100)
      setDownloadState('ready')

      // Trigger the Android package installer
      const installPath = result.path ?? fileUri
      await FileOpener.openFile({
        path: installPath,
        mimeType: 'application/vnd.android.package-archive',
      })
    } catch (e) {
      console.error('APK update error:', e)
      setDownloadState('error')
    } finally {
      if (progressHandle) {
        await progressHandle.remove()
      }
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
