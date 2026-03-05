interface Props {
  title: string
  subtitle?: string
  right?: React.ReactNode
}

export default function PageHeader({ title, subtitle, right }: Props) {
  return (
    <div
      className="flex items-center justify-between px-4 pb-3 flex-shrink-0"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))' }}
    >
      <div>
        <h1 className="text-xl font-bold text-slate-100 leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}
