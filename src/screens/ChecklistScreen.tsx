import { useState, useCallback } from 'react'
import { Check, ChevronRight, ArrowLeft, ClipboardCheck, RefreshCw, Trash2 } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Default items — in future these will be pushed from the admin portal per project
const TEMPLATE_ITEMS = [
  'Verify cable labelling on all ports',
  'Check earth bonding and continuity',
  'Photograph cabinet interior (before)',
  'Test signal levels at all antenna ports',
  'Verify power redundancy (UPS/generator)',
  'Check ambient temperature and ventilation',
  'Inspect cable management and routing',
  'Verify fibre connections — no excessive bend radius',
  'Test alarm outputs at monitoring system',
  'Record site photos — exterior and access road',
  'Check battery voltage under load',
  'Complete and sign site logbook entry',
]

const PROJECTS = [
  { code: 'PWR-2024-041', label: 'Tower Upgrade — Silverdale' },
  { code: 'PWR-2024-038', label: 'Fibre Node — Orewa' },
  { code: 'PWR-2024-033', label: 'RBS Swap — Henderson' },
]

interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

interface Checklist {
  id: string
  project: string
  projectLabel: string
  date: string
  items: ChecklistItem[]
}

function uid() { return Math.random().toString(36).slice(2, 9) }

function newChecklist(projectCode: string): Checklist {
  const project = PROJECTS.find(p => p.code === projectCode) ?? PROJECTS[0]
  return {
    id: uid(),
    project: project.code,
    projectLabel: project.label,
    date: new Date().toISOString(),
    items: TEMPLATE_ITEMS.map(text => ({ id: uid(), text, done: false })),
  }
}

export default function ChecklistScreen() {
  const [checklists, setChecklists] = useLocalStorage<Checklist[]>('powertec-checklists-v2', [])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0].code)

  const active = checklists.find(c => c.id === activeId) ?? null

  const createChecklist = useCallback(() => {
    const cl = newChecklist(selectedProject)
    setChecklists(prev => [cl, ...prev])
    setActiveId(cl.id)
    setShowNewModal(false)
  }, [selectedProject, setChecklists])

  const toggleItem = useCallback((checklistId: string, itemId: string) => {
    setChecklists(prev => prev.map(c =>
      c.id !== checklistId ? c : {
        ...c,
        items: c.items.map(i => i.id === itemId ? { ...i, done: !i.done } : i),
      }
    ))
  }, [setChecklists])

  const resetChecklist = useCallback((checklistId: string) => {
    setChecklists(prev => prev.map(c =>
      c.id !== checklistId ? c : {
        ...c,
        items: c.items.map(i => ({ ...i, done: false })),
      }
    ))
  }, [setChecklists])

  const deleteChecklist = useCallback((id: string) => {
    setChecklists(prev => prev.filter(c => c.id !== id))
    if (activeId === id) setActiveId(null)
  }, [activeId, setChecklists])

  /* ── Detail view ── */
  if (active) {
    const done = active.items.filter(i => i.done).length
    const total = active.items.length
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    const complete = pct === 100

    return (
      <div className="h-full flex flex-col bg-slate-50 dark:bg-[#0d1117]">
        {/* Header */}
        <div
          className="bg-white dark:bg-[#161b22] border-b border-slate-100 dark:border-slate-800 px-4 pb-4 flex-shrink-0"
          style={{ paddingTop: 'max(2.75rem, env(safe-area-inset-top, 0px))' }}
        >
          <button onClick={() => setActiveId(null)} className="flex items-center gap-1.5 text-brand-500 text-sm font-semibold tap-active mb-3">
            <ArrowLeft size={16} /> Checklists
          </button>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-snug truncate">{active.projectLabel}</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{active.project}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => resetChecklist(active.id)} className="p-2 text-slate-400 tap-active">
                <RefreshCw size={15} />
              </button>
              <button onClick={() => deleteChecklist(active.id)} className="p-2 text-slate-400 tap-active">
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 dark:text-slate-500">{done} of {total} complete</span>
              <span className={`text-xs font-bold ${complete ? 'text-green-500' : 'text-brand-500'}`}>{pct}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${complete ? 'bg-green-500' : 'bg-brand-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 scrollable no-scrollbar px-4 py-4 flex flex-col gap-2">
          {complete && (
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900 rounded-2xl px-4 py-3 mb-2">
              <Check size={16} className="text-green-500 flex-shrink-0" />
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">All items complete!</p>
            </div>
          )}

          {active.items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => toggleItem(active.id, item.id)}
              className="w-full flex items-center gap-3 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 tap-active text-left shadow-sm"
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                item.done ? 'bg-green-500 border-green-500' : 'border-slate-300 dark:border-slate-600'
              }`}>
                {item.done && <Check size={13} className="text-white" strokeWidth={3} />}
              </div>
              <span className={`flex-1 text-sm leading-snug ${
                item.done
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-200'
              }`}>
                {i + 1}. {item.text}
              </span>
            </button>
          ))}

          <div className="h-2" />
        </div>
      </div>
    )
  }

  /* ── List view ── */
  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#0d1117]">
      {/* Header */}
      <div
        className="bg-white dark:bg-[#161b22] border-b border-slate-100 dark:border-slate-800 px-5 pb-4 flex-shrink-0"
        style={{ paddingTop: 'max(2.75rem, env(safe-area-inset-top, 0px))' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Checklists</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{checklists.length} checklist{checklists.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="bg-brand-500 text-white text-sm font-bold px-4 py-2 rounded-xl tap-active"
          >
            + New
          </button>
        </div>
      </div>

      <div className="flex-1 scrollable no-scrollbar px-4 py-4 flex flex-col gap-3">
        {checklists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <ClipboardCheck size={28} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No checklists yet</p>
            <button onClick={() => setShowNewModal(true)} className="text-brand-500 text-sm font-semibold tap-active">
              Create your first checklist
            </button>
          </div>
        ) : (
          checklists.map(c => {
            const done = c.items.filter(i => i.done).length
            const pct = c.items.length > 0 ? Math.round((done / c.items.length) * 100) : 0
            const complete = pct === 100
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className="w-full text-left bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm tap-active overflow-hidden flex"
              >
                <div className={`w-1 self-stretch flex-shrink-0 ${complete ? 'bg-green-500' : 'bg-brand-500'}`} />
                <div className="flex-1 px-4 py-4 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm leading-snug truncate">{c.projectLabel}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5">{c.project}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-bold ${complete ? 'text-green-500' : 'text-brand-500'}`}>{pct}%</span>
                      <ChevronRight size={15} className="text-slate-300 dark:text-slate-600" />
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mt-2.5 mb-1.5">
                    <div
                      className={`h-full rounded-full transition-all ${complete ? 'bg-green-500' : 'bg-brand-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {done} of {c.items.length} · {new Date(c.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </button>
            )
          })
        )}
        <div className="h-2" />
      </div>

      {/* New checklist modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowNewModal(false)}>
          <div
            className="w-full bg-white dark:bg-[#161b22] rounded-t-3xl p-6"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-5" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">New Checklist</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">Select the project this checklist is for</p>

            <div className="flex flex-col gap-2 mb-5">
              {PROJECTS.map(p => (
                <button
                  key={p.code}
                  onClick={() => setSelectedProject(p.code)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border tap-active text-left transition-all ${
                    selectedProject === p.code
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d1117]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selectedProject === p.code ? 'border-brand-500 bg-brand-500' : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {selectedProject === p.code && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${selectedProject === p.code ? 'text-brand-500' : 'text-slate-900 dark:text-white'}`}>{p.label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{p.code}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={createChecklist}
              className="w-full bg-brand-500 text-white font-bold py-4 rounded-2xl tap-active text-base"
            >
              Start Checklist
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
