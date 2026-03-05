import { RefreshCw, X } from 'lucide-react'

interface Props {
  onUpdate: () => void
  onDismiss: () => void
}

export default function UpdatePrompt({ onUpdate, onDismiss }: Props) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 bg-brand-500 text-white text-sm font-medium flex-shrink-0"
      style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top, 0px))' }}
    >
      <span className="flex-1">App update available</span>
      <button
        onClick={onUpdate}
        className="flex items-center gap-1.5 bg-white text-brand-500 px-3 py-1.5 rounded-lg font-semibold text-xs tap-active"
        style={{ minHeight: 36 }}
      >
        <RefreshCw size={13} /> Update now
      </button>
      <button
        onClick={onDismiss}
        className="text-blue-200 hover:text-white p-1 tap-active"
        style={{ minHeight: 36, minWidth: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <X size={16} />
      </button>
    </div>
  )
}
