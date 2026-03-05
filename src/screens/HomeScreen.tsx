import { FolderOpen, ClipboardCheck, Camera, ChevronRight, MapPin, Clock, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const APP_VERSION = '1.0.0'

// Mock data — replaced with real API data once backend is connected
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
]

const MOCK_ALERTS = [
  { id: '1', text: 'Site induction required before attending Silverdale site', type: 'warning' },
  { id: '2', text: 'Upload completion photos for PWR-2024-035 by Friday', type: 'info' },
]

const statusConfig = {
  active:    { label: 'Active',    bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  pending:   { label: 'Pending',   bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  complete:  { label: 'Complete',  bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
}

export default function HomeScreen() {
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="h-full scrollable no-scrollbar">

      {/* Header */}
      <div
        className="px-5 pb-5 bg-white border-b border-slate-100"
        style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top, 0px))' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">{greeting}</p>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">{MOCK_USER.name}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
            {MOCK_USER.name.split(' ').map(n => n[0]).join('')}
          </div>
        </div>

        {/* Powertec logo */}
        <div className="mt-4 flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Powertec Telecommunications"
            className="h-10 w-10 rounded-xl object-cover flex-shrink-0"
          />
          <div>
            <p className="text-xs font-bold text-brand-500 leading-none">POWERTEC TELECOMMUNICATIONS</p>
            <p className="text-xs text-slate-400 mt-0.5">Contractor Portal v{APP_VERSION}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-5">

        {/* Alerts */}
        {MOCK_ALERTS.length > 0 && (
          <div className="flex flex-col gap-2">
            {MOCK_ALERTS.map(alert => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${
                  alert.type === 'warning'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <AlertCircle
                  size={16}
                  className={`flex-shrink-0 mt-0.5 ${alert.type === 'warning' ? 'text-amber-500' : 'text-blue-500'}`}
                />
                <p className={`text-xs leading-snug ${alert.type === 'warning' ? 'text-amber-800' : 'text-blue-800'}`}>
                  {alert.text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Active projects */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900">My Projects</h2>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs text-brand-500 font-semibold flex items-center gap-0.5 tap-active"
            >
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_PROJECTS.map(project => {
              const s = statusConfig[project.status as keyof typeof statusConfig]
              return (
                <button
                  key={project.id}
                  onClick={() => navigate('/projects')}
                  className="card p-4 text-left tap-active w-full"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm leading-snug">{project.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">{project.code}</p>
                    </div>
                    <span className={`badge ${s.bg} ${s.text} flex-shrink-0`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} mr-1.5`} />
                      {s.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={11} /> {project.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={11} /> Due {project.due}
                    </span>
                  </div>

                  {project.status === 'active' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-400">Progress</span>
                        <span className="text-xs font-semibold text-brand-500">{project.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-500 transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: FolderOpen,    label: 'Projects',  to: '/projects',  color: 'text-blue-500',  bg: 'bg-blue-50' },
              { icon: ClipboardCheck, label: 'Checklist', to: '/checklist', color: 'text-green-500', bg: 'bg-green-50' },
              { icon: Camera,        label: 'Photos',    to: '/photos',    color: 'text-purple-500', bg: 'bg-purple-50' },
            ].map(({ icon: Icon, label, to, color, bg }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className="card p-4 flex flex-col items-center gap-2 tap-active"
              >
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={20} className={color} />
                </div>
                <span className="text-xs font-semibold text-slate-600">{label}</span>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
