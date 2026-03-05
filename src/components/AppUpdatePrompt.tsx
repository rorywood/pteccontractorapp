import { Download, X } from 'lucide-react'
import type { UpdateInfo } from '../hooks/useAppUpdater'

interface Props {
  info: UpdateInfo
  onDismiss: () => void
}

export default function AppUpdatePrompt({ info, onDismiss }: Props) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 bg-brand-500 text-white text-sm flex-shrink-0"
      style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))' }}
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">Update v{info.version} available</p>
        {info.releaseNotes && (
          <p className="text-blue-100 text-xs mt-0.5 truncate">{info.releaseNotes}</p>
        )}
      </div>
      <a
        href={info.apkUrl}
        className="flex items-center gap-1.5 bg-white text-brand-500 px-3 py-1.5 rounded-lg font-semibold text-xs tap-active flex-shrink-0"
        style={{ minHeight: 36 }}
      >
        <Download size={13} /> Download
      </a>
      <button
        onClick={onDismiss}
        className="text-blue-200 p-1 tap-active"
        style={{ minHeight: 36, minWidth: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <X size={16} />
      </button>
    </div>
  )
}
