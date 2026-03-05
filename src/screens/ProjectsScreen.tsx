import { useState } from 'react'
import {
  MapPin, Clock, ChevronRight, FileText, Image, Upload,
  ArrowLeft, FolderOpen, Download, Eye,
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

const statusConfig = {
  active:   { label: 'Active',   bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500', border: 'border-green-200' },
  pending:  { label: 'Pending',  bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200' },
  complete: { label: 'Complete', bg: 'bg-blue-50',  text: 'text-blue-700',  dot: 'bg-blue-500',  border: 'border-blue-200' },
}

type Project = typeof MOCK_PROJECTS[0]

export default function ProjectsScreen() {
  const [selected, setSelected] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState<'docs' | 'photos'>('docs')

  if (selected) {
    return <ProjectDetail project={selected} onBack={() => setSelected(null)} activeTab={activeTab} setActiveTab={setActiveTab} />
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-slate-100 px-4 pb-4 flex-shrink-0" style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top, 0px))' }}>
        <h1 className="text-xl font-bold text-slate-900">My Projects</h1>
        <p className="text-xs text-slate-400 mt-0.5">{MOCK_PROJECTS.length} projects assigned</p>
      </div>

      <div className="flex-1 scrollable no-scrollbar px-4 py-4 flex flex-col gap-3">
        {MOCK_PROJECTS.map(project => {
          const s = statusConfig[project.status as keyof typeof statusConfig]
          return (
            <button
              key={project.id}
              onClick={() => { setSelected(project); setActiveTab('docs') }}
              className="card p-4 text-left tap-active w-full"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm leading-snug">{project.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">{project.code}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`badge ${s.bg} ${s.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot} mr-1`} />
                    {s.label}
                  </span>
                  <ChevronRight size={16} className="text-slate-300" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin size={11} /> {project.location}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={11} /> Due {project.due}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <FileText size={11} /> {project.documents.length} docs
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Image size={11} /> {project.photos.length} photos
                </span>
                {project.status === 'active' && (
                  <div className="flex-1 flex items-center gap-2 justify-end">
                    <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-brand-500">{project.progress}%</span>
                  </div>
                )}
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
  const s = statusConfig[project.status as keyof typeof statusConfig]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 pb-4 flex-shrink-0" style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top, 0px))' }}>
        <button onClick={onBack} className="flex items-center gap-1 text-brand-500 text-sm font-medium tap-active mb-3">
          <ArrowLeft size={16} /> Projects
        </button>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-snug">{project.name}</h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{project.code}</p>
          </div>
          <span className={`badge ${s.bg} ${s.text} flex-shrink-0`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot} mr-1`} />
            {s.label}
          </span>
        </div>
      </div>

      <div className="flex-1 scrollable no-scrollbar">
        {/* Info strip */}
        <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={12} className="text-slate-400" /> {project.location}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock size={12} className="text-slate-400" /> Due {project.due}
          </div>
        </div>

        <div className="px-4 py-4 flex flex-col gap-4">
          {/* Description */}
          <div className="card p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Scope of Work</p>
            <p className="text-sm text-slate-700 leading-relaxed">{project.description}</p>
          </div>

          {/* Progress */}
          {project.status === 'active' && (
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Progress</p>
                <span className="text-sm font-bold text-brand-500">{project.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
          )}

          {/* PM Contact */}
          <div className="card p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {project.contact.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{project.contact.name}</p>
              <p className="text-xs text-slate-400">{project.contact.role}</p>
            </div>
            <a href={`tel:${project.contact.phone}`} className="text-xs text-brand-500 font-semibold tap-active">
              Call
            </a>
          </div>

          {/* Tabs: Documents / Photos */}
          <div>
            <div className="flex bg-slate-100 rounded-xl p-1 gap-1 mb-3">
              {(['docs', 'photos'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold tap-active transition-all ${
                    activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                  }`}
                >
                  {tab === 'docs' ? `Documents (${project.documents.length})` : `Photos (${project.photos.length})`}
                </button>
              ))}
            </div>

            {activeTab === 'docs' ? (
              <div className="card overflow-hidden">
                {project.documents.map((doc, i) => (
                  <div
                    key={doc.id}
                    className={`flex items-center gap-3 px-4 py-3.5 ${i < project.documents.length - 1 ? 'border-b border-slate-100' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.type === 'pdf' ? 'bg-red-50' : 'bg-blue-50'}`}>
                      {doc.type === 'pdf'
                        ? <FileText size={16} className="text-red-500" />
                        : <Image size={16} className="text-blue-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900 font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-slate-400">{doc.size}</p>
                    </div>
                    <div className="flex items-center gap-2">
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
                    <div key={photo.id} className="card px-4 py-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <Image size={18} className="text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-900 font-medium">{photo.name}</p>
                        <p className="text-xs text-slate-400">{photo.date}</p>
                      </div>
                      <button className="p-2 text-slate-400 tap-active"><Eye size={16} /></button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <FolderOpen size={32} className="text-slate-200" />
                    <p className="text-sm text-slate-400">No photos uploaded yet</p>
                  </div>
                )}

                {/* Upload button */}
                <button className="card p-4 flex items-center justify-center gap-2 text-brand-500 font-semibold text-sm tap-active border-dashed border-2 border-brand-200 bg-brand-50">
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
