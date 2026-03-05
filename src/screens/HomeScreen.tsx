import { FolderOpen, ClipboardCheck, Camera, ChevronRight, MapPin, Clock, AlertTriangle, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CURRENT_VERSION } from '../hooks/useAppUpdater'

const MOCK_USER = { name: 'James Thornton', role: 'Contractor' }

const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'Tower Upgrade — Silverdale',
    code: 'PWR-2024-041',
    status: 'active',
    location: 'Silverdale, Auckland',
    due: '12 Mar 2025',
    progress: 65,
  },
  {
    id: '2',
    name: 'Fibre Node Install — Orewa',
    code: 'PWR-2024-038',
    status: 'pending',
    location: 'Orewa, Auckland',
    due: '18 Mar 2025',
    progress: 0,
  },
  {
    id: '3',
    name: 'RBS Swap — Henderson',
    code: 'PWR-2024-033',
    status: 'complete',
    location: 'Henderson, Auckland',
    due: '01 Feb 2025',
    progress: 100,
  },
]

const MOCK_ALERTS = [
  { id: '1', text: 'Site induction required before attending Silverdale site', type: 'warning' },
  { id: '2', text: 'Upload completion photos for PWR-2024-035 by Friday', type: 'info' },
]

const statusMeta = {
  active:   { label: 'Active',   accentLight: '#22c55e', accentDark: '#16a34a', badge: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400' },
  pending:  { label: 'Pending',  accentLight: '#f59e0b', accentDark: '#d97706', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400' },
  complete: { label: 'Complete', accentLight: '#1565C0', accentDark: '#1565C0', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400' },
}

export default function HomeScreen() {
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const initials = MOCK_USER.name.split(' ').map(n => n[0]).join('')

  const activeProject = MOCK_PROJECTS.find(p => p.status === 'active')
  const otherProjects = MOCK_PROJECTS.filter(p => p.status !== 'active')
  const activeCount = MOCK_PROJECTS.filter(p => p.status === 'active').length
  const pendingCount = MOCK_PROJECTS.filter(p => p.status === 'pending').length

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-[#0d1117]">

      {/* Header */}
      <div
        className="flex-shrink-0 bg-white dark:bg-[#161b22] border-b border-slate-100 dark:border-slate-800"
        style={{ paddingTop: 'max(2.75rem, env(safe-area-inset-top, 0px))' }}
      >
        {/* Top row: greeting + avatar */}
        <div className="flex items-start justify-between px-5 pt-1 pb-4">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Powertec" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{greeting}</p>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{MOCK_USER.name}</h1>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="flex border-t border-slate-100 dark:border-slate-800">
          <StatCell value={activeCount} label="Active" color="text-green-500" />
          <div className="w-px bg-slate-100 dark:bg-slate-800" />
          <StatCell value={pendingCount} label="Pending" color="text-amber-500" />
          <div className="w-px bg-slate-100 dark:bg-slate-800" />
          <StatCell value={MOCK_ALERTS.length} label="Alerts" color="text-red-500" />
          <div className="w-px bg-slate-100 dark:bg-slate-800" />
          <StatCell value={`v${CURRENT_VERSION}`} label="Version" color="text-brand-500" />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 scrollable no-scrollbar px-4 py-4 flex flex-col gap-4">

        {/* Current job */}
        {activeProject && (() => {
          const m = statusMeta.active
          return (
            <button
              onClick={() => navigate('/projects')}
              className="w-full text-left tap-active"
            >
              <div
                className="bg-white dark:bg-[#161b22] rounded-2xl shadow-sm overflow-hidden"
                style={{ borderLeft: `4px solid ${m.accentLight}` }}
              >
                <div className="px-4 pt-4 pb-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Current Job</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{activeProject.code}</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white text-base leading-snug">{activeProject.name}</p>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                      <MapPin size={11} /> {activeProject.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                      <Clock size={11} /> Due {activeProject.due}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Progress</span>
                    <span className="text-xs font-bold text-brand-500">{activeProject.progress}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-500"
                      style={{ width: `${activeProject.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-end mt-3">
                    <span className="text-xs font-semibold text-brand-500 flex items-center gap-0.5">
                      Open project <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              </div>
            </button>
          )
        })()}

        {/* Alerts */}
        {MOCK_ALERTS.length > 0 && (
          <div className="flex flex-col gap-2">
            {MOCK_ALERTS.map(alert => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 px-4 py-3 rounded-2xl ${
                  alert.type === 'warning'
                    ? 'bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800'
                    : 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900'
                }`}
              >
                {alert.type === 'warning'
                  ? <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  : <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                }
                <p className={`text-xs leading-relaxed ${alert.type === 'warning' ? 'text-amber-800 dark:text-amber-300' : 'text-blue-800 dark:text-blue-300'}`}>
                  {alert.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Quick actions */}
        <div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Quick Access</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: FolderOpen,     label: 'Projects',  to: '/projects',  iconColor: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-500/10' },
              { icon: ClipboardCheck, label: 'Checklist', to: '/checklist', iconColor: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-500/10' },
              { icon: Camera,         label: 'Photos',    to: '/photos',    iconColor: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10' },
            ].map(({ icon: Icon, label, to, iconColor, bg }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col items-center gap-2.5 tap-active shadow-sm"
              >
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={22} className={iconColor} />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Other projects */}
        {otherProjects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Other Projects</p>
              <button onClick={() => navigate('/projects')} className="text-xs text-brand-500 font-semibold flex items-center gap-0.5 tap-active">
                View all <ChevronRight size={13} />
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              {otherProjects.map(project => {
                const m = statusMeta[project.status as keyof typeof statusMeta]
                return (
                  <button
                    key={project.id}
                    onClick={() => navigate('/projects')}
                    className="w-full text-left bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm tap-active overflow-hidden flex"
                  >
                    <div className="w-1 self-stretch flex-shrink-0" style={{ background: m.accentLight }} />
                    <div className="flex-1 px-4 py-3 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm leading-snug truncate">{project.name}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${m.badge}`}>
                          {m.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                          <MapPin size={10} /> {project.location}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                          <Clock size={10} /> Due {project.due}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center pr-3">
                      <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="h-2" />
      </div>
    </div>
  )
}

function StatCell({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div className="flex-1 flex flex-col items-center py-3 gap-0.5">
      <span className={`text-lg font-bold leading-none ${color}`}>{value}</span>
      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{label}</span>
    </div>
  )
}
