import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, ClipboardCheck, Camera, Settings } from 'lucide-react'

const tabs = [
  { to: '/',          icon: LayoutDashboard, label: 'Home' },
  { to: '/projects',  icon: FolderOpen,      label: 'Projects' },
  { to: '/checklist', icon: ClipboardCheck,  label: 'Checklist' },
  { to: '/photos',    icon: Camera,          label: 'Photos' },
  { to: '/settings',  icon: Settings,        label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav
      className="bg-white border-t border-slate-200 flex-shrink-0"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 tap-active transition-colors ${
                isActive ? 'text-brand-500' : 'text-slate-400'
              }`
            }
            style={{ minHeight: 56 }}
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-brand-50' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className="text-[10px] font-medium leading-none">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
