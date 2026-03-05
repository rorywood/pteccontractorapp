import { useState, useCallback } from 'react'
import {
  Plus, Trash2, GripVertical, Check, ChevronDown, ChevronRight,
  FolderPlus, X,
} from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from '../components/PageHeader'

interface ChecklistItem {
  id: string
  text: string
  done: boolean
}

interface Checklist {
  id: string
  name: string
  date: string
  items: ChecklistItem[]
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  { id: '1', text: 'Verify cable labelling on all ports', done: false },
  { id: '2', text: 'Check earth bonding and continuity', done: false },
  { id: '3', text: 'Photograph cabinet interior (before/after)', done: false },
  { id: '4', text: 'Test signal levels at all antenna ports', done: false },
  { id: '5', text: 'Verify power redundancy (UPS/generator)', done: false },
  { id: '6', text: 'Check ambient temperature and ventilation', done: false },
  { id: '7', text: 'Inspect cable management and routing', done: false },
  { id: '8', text: 'Verify fibre connections — no excessive bend radius', done: false },
  { id: '9', text: 'Test alarm outputs at monitoring system', done: false },
  { id: '10', text: 'Record site photos — exterior, access road', done: false },
  { id: '11', text: 'Check battery voltage under load', done: false },
  { id: '12', text: 'Complete and sign site logbook entry', done: false },
]

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export default function ChecklistScreen() {
  const [checklists, setChecklists] = useLocalStorage<Checklist[]>('powertec-checklists', [])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)

  const active = checklists.find((c) => c.id === activeId) ?? null

  const createChecklist = useCallback(() => {
    const name = newName.trim() || `Site Audit ${new Date().toLocaleDateString('en-GB')}`
    const checklist: Checklist = {
      id: uid(),
      name,
      date: new Date().toISOString(),
      items: DEFAULT_ITEMS.map((i) => ({ ...i, id: uid(), done: false })),
    }
    setChecklists((prev) => [checklist, ...prev])
    setActiveId(checklist.id)
    setShowNew(false)
    setNewName('')
  }, [newName, setChecklists])

  const updateItem = useCallback(
    (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => {
      setChecklists((prev) =>
        prev.map((c) =>
          c.id === checklistId
            ? { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)) }
            : c
        )
      )
    },
    [setChecklists]
  )

  const addItem = useCallback(
    (checklistId: string, text: string) => {
      if (!text.trim()) return
      setChecklists((prev) =>
        prev.map((c) =>
          c.id === checklistId
            ? { ...c, items: [...c.items, { id: uid(), text: text.trim(), done: false }] }
            : c
        )
      )
    },
    [setChecklists]
  )

  const deleteItem = useCallback(
    (checklistId: string, itemId: string) => {
      setChecklists((prev) =>
        prev.map((c) =>
          c.id === checklistId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
        )
      )
    },
    [setChecklists]
  )

  const deleteChecklist = useCallback(
    (id: string) => {
      setChecklists((prev) => prev.filter((c) => c.id !== id))
      if (activeId === id) setActiveId(null)
    },
    [activeId, setChecklists]
  )

  // Drag-to-reorder
  const handleDragStart = (id: string) => setDragging(id)
  const handleDragOver = (id: string) => setDragOver(id)
  const handleDrop = useCallback(
    (checklistId: string) => {
      if (!dragging || !dragOver || dragging === dragOver) return
      setChecklists((prev) =>
        prev.map((c) => {
          if (c.id !== checklistId) return c
          const items = [...c.items]
          const fromIdx = items.findIndex((i) => i.id === dragging)
          const toIdx = items.findIndex((i) => i.id === dragOver)
          if (fromIdx < 0 || toIdx < 0) return c
          const [moved] = items.splice(fromIdx, 1)
          items.splice(toIdx, 0, moved)
          return { ...c, items }
        })
      )
      setDragging(null)
      setDragOver(null)
    },
    [dragging, dragOver, setChecklists]
  )

  /* ── List view ── */
  if (!active) {
    return (
      <div className="h-full flex flex-col">
        <PageHeader
          title="Checklists"
          right={
            <button
              onClick={() => setShowNew(true)}
              className="flex items-center gap-1.5 bg-accent text-navy-900 font-semibold text-sm px-3 py-2 rounded-xl tap-active"
            >
              <FolderPlus size={15} /> New
            </button>
          }
        />

        {/* New checklist form */}
        {showNew && (
          <div className="mx-4 mb-4 card p-4 flex flex-col gap-3 flex-shrink-0">
            <p className="text-sm font-semibold text-slate-200">New checklist</p>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={`Site Audit ${new Date().toLocaleDateString('en-GB')}`}
              className="bg-navy-900 border border-navy-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-accent"
              onKeyDown={(e) => e.key === 'Enter' && createChecklist()}
            />
            <div className="flex gap-2">
              <button
                onClick={createChecklist}
                className="flex-1 bg-accent text-navy-900 font-bold py-2.5 rounded-xl tap-active text-sm"
              >
                Create
              </button>
              <button
                onClick={() => setShowNew(false)}
                className="flex-1 bg-navy-700 text-slate-200 font-semibold py-2.5 rounded-xl tap-active text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 scrollable no-scrollbar px-4 pb-4">
          {checklists.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <div className="w-14 h-14 rounded-full bg-navy-800 flex items-center justify-center">
                <Plus size={24} className="text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm">No checklists yet</p>
              <button
                onClick={() => setShowNew(true)}
                className="text-accent text-sm font-semibold tap-active"
              >
                Create your first checklist
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {checklists.map((c) => {
                const done = c.items.filter((i) => i.done).length
                const pct = c.items.length > 0 ? Math.round((done / c.items.length) * 100) : 0
                return (
                  <div
                    key={c.id}
                    className="card p-4 tap-active cursor-pointer"
                    onClick={() => setActiveId(c.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-100 text-sm">{c.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(c.date).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-accent font-semibold">{pct}%</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteChecklist(c.id) }}
                          className="p-2 text-slate-500 hover:text-red-400 tap-active"
                        >
                          <Trash2 size={15} />
                        </button>
                        <ChevronRight size={16} className="text-slate-500" />
                      </div>
                    </div>
                    <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: pct === 100 ? '#34d399' : '#00d4ff',
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5">
                      {done} of {c.items.length} complete
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ── Detail view ── */
  const done = active.items.filter((i) => i.done).length
  const pct = active.items.length > 0 ? Math.round((done / active.items.length) * 100) : 0
  const [newItemText, setNewItemText] = useState('')

  return (
    <div className="h-full flex flex-col">
      <div
        className="px-4 pb-3 flex-shrink-0 flex items-center gap-2"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))' }}
      >
        <button
          onClick={() => setActiveId(null)}
          className="p-2 text-slate-400 tap-active -ml-1"
        >
          <ChevronDown size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-slate-100 leading-tight">{active.name}</h1>
          <p className="text-xs text-slate-500">
            {done}/{active.items.length} · {pct}% complete
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-4 mb-3 h-2 bg-navy-800 rounded-full overflow-hidden flex-shrink-0">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: pct === 100 ? '#34d399' : '#00d4ff' }}
        />
      </div>

      {/* Items */}
      <div className="flex-1 scrollable no-scrollbar px-4 pb-4">
        <div className="flex flex-col gap-2">
          {active.items.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={(e) => { e.preventDefault(); handleDragOver(item.id) }}
              onDrop={() => handleDrop(active.id)}
              className={`flex items-center gap-3 card px-3 py-3 transition-opacity ${
                dragOver === item.id ? 'ring-1 ring-accent' : ''
              } ${dragging === item.id ? 'opacity-40' : ''}`}
            >
              <GripVertical size={16} className="text-slate-600 flex-shrink-0 cursor-grab" />
              <button
                onClick={() => updateItem(active.id, item.id, { done: !item.done })}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 tap-active transition-all ${
                  item.done
                    ? 'bg-green-500 border-green-500'
                    : 'border-slate-600'
                }`}
              >
                {item.done && <Check size={13} className="text-white" strokeWidth={3} />}
              </button>
              <span
                className={`flex-1 text-sm leading-snug ${
                  item.done ? 'line-through text-slate-500' : 'text-slate-200'
                }`}
              >
                {item.text}
              </span>
              <button
                onClick={() => deleteItem(active.id, item.id)}
                className="p-1.5 text-slate-600 hover:text-red-400 tap-active flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Add item */}
        <div className="flex gap-2 mt-3">
          <input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add item..."
            className="flex-1 bg-navy-800 border border-navy-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-accent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addItem(active.id, newItemText)
                setNewItemText('')
              }
            }}
          />
          <button
            onClick={() => { addItem(active.id, newItemText); setNewItemText('') }}
            className="bg-navy-700 text-accent px-4 rounded-xl tap-active"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
