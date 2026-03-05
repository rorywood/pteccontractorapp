import { useState } from 'react'
import {
  MapPin, Clock, ChevronRight, FileText, Image, Upload,
  ArrowLeft, FolderOpen, Download, Eye, Phone,
} from 'lucide-react'

const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'Tower Upgrade — Silverdale',
    code: 'PWR-2024-041',
    status: 'active',
    location: 'Silverdale, Auckland',
    due: '12 Mar 2025',
    progress: 65,
    description: 'Structural upgrade to existing 40m tower. Replace antenna mounts, install new cable management system and upgrade power distribution.',
    documents: [
      { id: 'd1', name: 'Site Safety Plan.pdf', type: 'pdf', size: '2.4 MB' },
      { id: 'd2', name: 'Structural Drawings Rev3.pdf', type: 'pdf', size: '8.1 MB' },
      { id: 'd3', name: 'Scope of Works.pdf', type: 'pdf', size: '1.2 MB' },
      { id: 'd4', name: 'Site Photo - Existing.jpg', type: 'image', size: '3.8 MB' },
    ],
    photos: [
      { id: 'p1', name: 'Site arrival photo', date: '28 Feb 2025' },
      { id: 'p2', name: 'Antenna mount before', date: '28 Feb 2025' },
    ],
    contact: { name: 'Sarah Mitchell', role: 'Project Manager', phone: '021 555 0123' },
  },
  {
    id: '2',
    name: 'Fibre Node Install — Orewa',
    code: 'PWR-2024-038',
    status: 'pending',
    location: 'Orewa, Auckland',
    due: '18 Mar 2025',
    progress: 0,
    description: 'Install new fibre distribution node at council-approved location. Civil works complete, equipment on-site.',
    documents: [
      { id: 'd1', name: 'Installation Spec.pdf', type: 'pdf', size: '4.2 MB' },
      { id: 'd2', name: 'Council Consent.pdf', type: 'pdf', size: '0.8 MB' },
    ],
    photos: [],
    contact: { name: 'Mark Davies', role: 'Project Manager', phone: '021 555 0456' },
  },
  {
    id: '3',
    name: 'RBS Swap — Henderson',
    code: 'PWR-2024-033',
    status: 'complete',
    location: 'Henderson, Auckland',
    due: '01 Feb 2025',
    progress: 100,
    description: 'Full RBS equipment swap completed. New Ericsson AIR units installed and commissioned.',
    documents: [
      { id: 'd1', name: 'Completion Report.pdf', type: 'pdf', size: '5.6 MB' },
    ],
    photos: [
      { id: 'p1', name: 'Final installation', date: '01 Feb 2025' },
      { id: 'p2', name: 'Equipment commissioning', date: '01 Feb 2025' },
      { id: 'p3', name: 'Site closeout', date: '01 Feb 2025' },
    ],
    contact: { name: 'Sarah Mitchell', role: 'Project Manager', phone: '021 555 0123' },
  },
]

const statusMeta = {
  active:   { label: 'Active',   accent: '#22c55e', badge: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400' },
  pending:  { label: 'Pending',  accent: '#f59e0b', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400' },
  complete: { label: 'Complete', accent: '#1565C0', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400' },
}

type Project = typeof MOCK_PROJECTS[0]

export default function ProjectsScreen() {
  const [selected, setSelected] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState<'docs' | 'photos'>('docs')

  if (selected) {
    return <ProjectDetail project={selected} onBack={() => setSelected(null)} activeTab={activeTab} setActiveTab={setActiveTab} />
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#0d1117]">
      <div
        className="bg-white dark:bg-[#161b22] border-b border-slate-100 dark:border-slate-800 px-5 pb-4 flex-shrink-0"
        style={{ paddingTop: 'max(2.75rem, env(safe-area-inset-top, 0px))' }}
      >
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">My Projects</h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{MOCK_PROJECTS.length} projects assigned</p>
      </div>

      <div className="flex-1 scrollable no-scrollbar px-4 py-4 flex flex-col gap-3">
        {MOCK_PROJECTS.map(project => {
          const m = statusMeta[project.status as keyof typeof statusMeta]
          return (
            <button
              key={project.id}
              onClick={() => { setSelected(project); setActiveTab('docs') }}
              className="w-full text-left bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm tap-active overflow-hidden flex"
            >
              <div className="w-1 self-stretch flex-shrink-0" style={{ background: m.accent }} />
              <div className="flex-1 px-4 py-4 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">{project.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">{project.code}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${m.badge}`}>
                      {m.label}
                    </span>
                    <ChevronRight size={15} className="text-slate-300 dark:text-slate-600" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                    <MapPin size={11} /> {project.location}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                    <Clock size={11} /> Due {project.due}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                    <FileText size={11} /> {project.documents.length} docs
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                    <Image size={11} /> {project.photos.length} photos
                  </span>
                  {project.status === 'active' && (
                    <div className="flex-1 flex items-center gap-2 justify-end">
                      <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full" style={{ width: `${project.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-brand-500">{project.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ProjectDetail({
  project, onBack, activeTab, setActiveTab,
}: {
  project: Project
  onBack: () => void
  activeTab: 'docs' | 'photos'
  setActiveTab: (t: 'docs' | 'photos') => void
}) {
  const m = statusMeta[project.status as keyof typeof statusMeta]

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#0d1117]">
      {/* Header */}
      <div
        className="bg-white dark:bg-[#161b22] border-b border-slate-100 dark:border-slate-800 px-4 pb-4 flex-shrink-0"
        style={{ paddingTop: 'max(2.75rem, env(safe-area-inset-top, 0px))' }}
      >
        <button onClick={onBack} className="flex items-center gap-1.5 text-brand-500 text-sm font-semibold tap-active mb-3">
          <ArrowLeft size={16} /> Projects
        </button>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{project.name}</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{project.code}</p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${m.badge}`}>
            {m.label}
          </span>
        </div>
      </div>

      <div className="flex-1 scrollable no-scrollbar">
        {/* Info strip */}
        <div className="bg-white dark:bg-[#161b22] border-b border-slate-100 dark:border-slate-800 px-5 py-3 flex gap-5">
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin size={12} className="text-slate-400" /> {project.location}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Clock size={12} className="text-slate-400" /> Due {project.due}
          </span>
        </div>

        <div className="px-4 py-4 flex flex-col gap-4">
          {/* Scope */}
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Scope of Work</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{project.description}</p>
          </div>

          {/* Progress */}
          {project.status === 'active' && (
            <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Progress</p>
                <span className="text-sm font-bold text-brand-500">{project.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
          )}

          {/* PM Contact */}
          <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {project.contact.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{project.contact.name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{project.contact.role}</p>
            </div>
            <a
              href={`tel:${project.contact.phone}`}
              className="flex items-center gap-1.5 bg-brand-500 text-white text-xs font-bold px-3 py-2 rounded-xl tap-active"
            >
              <Phone size={13} /> Call
            </a>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1 mb-3">
              {(['docs', 'photos'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold tap-active transition-all ${
                    activeTab === tab
                      ? 'bg-white dark:bg-[#161b22] text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {tab === 'docs' ? `Documents (${project.documents.length})` : `Photos (${project.photos.length})`}
                </button>
              ))}
            </div>

            {activeTab === 'docs' ? (
              <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {project.documents.map((doc, i) => (
                  <div
                    key={doc.id}
                    className={`flex items-center gap-3 px-4 py-3.5 ${i < project.documents.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${doc.type === 'pdf' ? 'bg-red-50 dark:bg-red-950' : 'bg-blue-50 dark:bg-blue-950'}`}>
                      {doc.type === 'pdf'
                        ? <FileText size={16} className="text-red-500" />
                        : <Image size={16} className="text-blue-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 dark:text-white font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{doc.size}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-2 text-slate-400 tap-active"><Eye size={16} /></button>
                      <button className="p-2 text-slate-400 tap-active"><Download size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {project.photos.length > 0 ? (
                  project.photos.map(photo => (
                    <div key={photo.id} className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <Image size={18} className="text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 dark:text-white font-medium">{photo.name}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{photo.date}</p>
                      </div>
                      <button className="p-2 text-slate-400 tap-active"><Eye size={16} /></button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 gap-2">
                    <FolderOpen size={36} className="text-slate-200 dark:text-slate-700" />
                    <p className="text-sm text-slate-400 dark:text-slate-500">No photos uploaded yet</p>
                  </div>
                )}
                <button className="bg-brand-50 dark:bg-brand-500/10 border-2 border-dashed border-brand-200 dark:border-brand-500/30 text-brand-500 rounded-2xl p-4 flex items-center justify-center gap-2 font-semibold text-sm tap-active">
                  <Upload size={18} />
                  Upload Completion Photos
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
