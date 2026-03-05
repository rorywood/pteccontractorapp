import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, ClipboardCheck, Camera, Settings } from 'lucide-react'

const tabs = [
  { to: '/',          icon: LayoutDashboard, label: 'Home' },
  { to: '/projects',  icon: FolderOpen,      label: 'Projects' },
  { to: '/checklist', icon: ClipboardCheck,  label: 'Tasks' },
  { to: '/photos',    icon: Camera,          label: 'Photos' },
  { to: '/settings',  icon: Settings,        label: 'Settings' },
]

export default function BottomNav() {
  return (
    <nav
      className="flex-shrink-0 bg-white dark:bg-[#161b22] border-t border-slate-100 dark:border-slate-800"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex px-2 pt-1">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex-1 flex flex-col items-center justify-center tap-active"
            style={{ minHeight: 52 }}
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center gap-1">
                <div className={`
                  flex items-center justify-center w-12 h-8 rounded-2xl transition-all duration-200
                  ${isActive
                    ? 'bg-brand-500 shadow-sm shadow-brand-500/30'
                    : 'bg-transparent'
                  }
                `}>
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}
                  />
                </div>
                <span className={`text-[10px] font-semibold leading-none transition-colors ${
                  isActive ? 'text-brand-500' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
