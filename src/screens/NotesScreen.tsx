import { useState, useCallback, useRef } from 'react'
import { Plus, Search, Trash2, ChevronRight, X, ArrowLeft } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PageHeader from '../components/PageHeader'

interface Note {
  id: string
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function NotesScreen() {
  const [notes, setNotes] = useLocalStorage<Note[]>('powertec-notes', [])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [swipeX, setSwipeX] = useState<Record<string, number>>({})
  const touchStart = useRef<Record<string, number>>({})

  const active = notes.find((n) => n.id === activeId) ?? null

  const createNote = useCallback(() => {
    const note: Note = {
      id: uid(),
      title: '',
      body: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setNotes((prev) => [note, ...prev])
    setActiveId(note.id)
  }, [setNotes])

  const updateNote = useCallback(
    (id: string, updates: Partial<Pick<Note, 'title' | 'body'>>) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
        )
      )
    },
    [setNotes]
  )

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id))
      if (activeId === id) setActiveId(null)
    },
    [activeId, setNotes]
  )

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.body.toLowerCase().includes(search.toLowerCase())
  )

  /* ── Editor view ── */
  if (active) {
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
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="text-xs text-slate-500">
              {active.updatedAt !== active.createdAt
                ? `Edited ${timeAgo(active.updatedAt)}`
                : `Created ${timeAgo(active.createdAt)}`}
            </p>
          </div>
          <button
            onClick={() => deleteNote(active.id)}
            className="p-2 text-slate-500 hover:text-red-400 tap-active"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex-1 flex flex-col px-4 pb-4 overflow-hidden">
          <input
            autoFocus={!active.title}
            value={active.title}
            onChange={(e) => updateNote(active.id, { title: e.target.value })}
            placeholder="Title"
            className="bg-transparent text-xl font-bold text-slate-100 placeholder-slate-600 outline-none mb-3 flex-shrink-0"
          />
          <textarea
            value={active.body}
            onChange={(e) => updateNote(active.id, { body: e.target.value })}
            placeholder="Start writing..."
            className="flex-1 bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none resize-none leading-relaxed scrollable no-scrollbar"
          />
        </div>
      </div>
    )
  }

  /* ── List view ── */
  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="Notes"
        right={
          <button
            onClick={createNote}
            className="flex items-center gap-1.5 bg-accent text-navy-900 font-semibold text-sm px-3 py-2 rounded-xl tap-active"
          >
            <Plus size={15} /> New
          </button>
        }
      />

      {/* Search */}
      <div className="px-4 mb-3 flex-shrink-0">
        <div className="flex items-center gap-2 bg-navy-800 border border-navy-700 rounded-xl px-3">
          <Search size={15} className="text-slate-500 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="flex-1 bg-transparent py-3 text-sm text-slate-100 placeholder-slate-500 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-500 tap-active">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 scrollable no-scrollbar px-4 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            {search ? (
              <p className="text-slate-400 text-sm">No notes match "{search}"</p>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-navy-800 flex items-center justify-center">
                  <Plus size={24} className="text-slate-500" />
                </div>
                <p className="text-slate-400 text-sm">No notes yet</p>
                <button onClick={createNote} className="text-accent text-sm font-semibold tap-active">
                  Create your first note
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((note) => (
              <div
                key={note.id}
                className="relative overflow-hidden rounded-xl"
                onTouchStart={(e) => {
                  touchStart.current[note.id] = e.touches[0].clientX
                }}
                onTouchMove={(e) => {
                  const startX = touchStart.current[note.id]
                  if (startX === undefined) return
                  const dx = e.touches[0].clientX - startX
                  if (dx < 0) {
                    setSwipeX((prev) => ({ ...prev, [note.id]: Math.max(-80, dx) }))
                  }
                }}
                onTouchEnd={() => {
                  const x = swipeX[note.id] ?? 0
                  if (x < -50) {
                    setSwipeX((prev) => ({ ...prev, [note.id]: -80 }))
                  } else {
                    setSwipeX((prev) => ({ ...prev, [note.id]: 0 }))
                  }
                  touchStart.current[note.id] = 0
                }}
              >
                {/* Delete action revealed on swipe */}
                <div className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center bg-red-500 rounded-r-xl">
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="flex flex-col items-center gap-1 text-white tap-active"
                  >
                    <Trash2 size={18} />
                    <span className="text-xs">Delete</span>
                  </button>
                </div>

                {/* Note card */}
                <div
                  className="card p-4 tap-active cursor-pointer relative bg-navy-800"
                  style={{ transform: `translateX(${swipeX[note.id] ?? 0}px)`, transition: 'transform 0.15s ease' }}
                  onClick={() => {
                    if ((swipeX[note.id] ?? 0) !== 0) {
                      setSwipeX((prev) => ({ ...prev, [note.id]: 0 }))
                      return
                    }
                    setActiveId(note.id)
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-100 text-sm truncate">
                        {note.title || 'Untitled'}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-snug">
                        {note.body || 'Empty note'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs text-slate-500">{timeAgo(note.updatedAt)}</span>
                      <ChevronRight size={14} className="text-slate-600" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
