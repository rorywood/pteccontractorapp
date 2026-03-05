import { Download, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import type { UpdateInfo } from '../hooks/useAppUpdater'
import type { DownloadState } from '../hooks/useAppUpdater'

interface Props {
  info: UpdateInfo
  onDismiss: () => void
  onInstall: () => void
  downloadState: DownloadState
  downloadProgress: number
}

export default function AppUpdatePrompt({ info, onDismiss, onInstall, downloadState, downloadProgress }: Props) {
  const isDownloading = downloadState === 'downloading'
  const isReady = downloadState === 'ready'
  const isError = downloadState === 'error'

  return (
    <div
      className="flex-shrink-0 bg-brand-500 text-white text-sm"
      style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))' }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Update v{info.version} available</p>
          {info.releaseNotes && !isDownloading && (
            <p className="text-blue-100 text-xs mt-0.5 truncate">{info.releaseNotes}</p>
          )}
          {isDownloading && (
            <p className="text-blue-100 text-xs mt-0.5">Downloading... {downloadProgress}%</p>
          )}
          {isReady && (
            <p className="text-blue-100 text-xs mt-0.5">Download complete — installing...</p>
          )}
          {isError && (
            <p className="text-red-200 text-xs mt-0.5">Download failed. Try again.</p>
          )}
        </div>

        {!isDownloading && !isReady && (
          <button
            onClick={onInstall}
            className="flex items-center gap-1.5 bg-white text-brand-500 px-3 py-1.5 rounded-lg font-semibold text-xs tap-active flex-shrink-0"
            style={{ minHeight: 36 }}
          >
            {isError ? <AlertCircle size={13} /> : <Download size={13} />}
            {isError ? 'Retry' : 'Update'}
          </button>
        )}

        {isDownloading && (
          <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-lg flex-shrink-0" style={{ minHeight: 36 }}>
            <Loader2 size={13} className="animate-spin" />
            <span className="text-xs font-semibold">{downloadProgress}%</span>
          </div>
        )}

        {isReady && (
          <div className="flex items-center gap-1.5 bg-green-400/30 px-3 py-1.5 rounded-lg flex-shrink-0" style={{ minHeight: 36 }}>
            <CheckCircle size={13} />
            <span className="text-xs font-semibold">Installing</span>
          </div>
        )}

        {!isDownloading && (
          <button
            onClick={onDismiss}
            className="text-blue-200 p-1 tap-active"
            style={{ minHeight: 36, minWidth: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isDownloading && (
        <div className="h-1 bg-white/20 mx-4 mb-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${downloadProgress}%` }}
          />
        </div>
      )}
    </div>
  )
}
