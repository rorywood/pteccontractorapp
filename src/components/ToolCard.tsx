import { LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  description: string
  icon: LucideIcon
  to: string
  accent?: string
}

export default function ToolCard({ title, description, icon: Icon, to, accent = '#00d4ff' }: Props) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(to)}
      className="card p-4 flex flex-col gap-3 text-left tap-active w-full"
      style={{ minHeight: 120 }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}
      >
        <Icon size={20} style={{ color: accent }} />
      </div>
      <div>
        <div className="font-semibold text-slate-100 text-sm leading-snug">{title}</div>
        <div className="text-slate-400 text-xs mt-0.5 leading-snug">{description}</div>
      </div>
    </button>
  )
}
