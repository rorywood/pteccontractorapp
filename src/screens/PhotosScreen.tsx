import { useState } from 'react'
import { Camera as CameraIcon, Upload, CheckCircle, Clock, FolderOpen, Trash2, X, ChevronDown } from 'lucide-react'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Photo {
  id: string
  dataUrl: string
  name: string
  project: string
  date: string
  status: 'pending' | 'uploaded'
}

const PROJECTS = [
  { code: 'PWR-2024-041', label: 'Tower Upgrade — Silverdale' },
  { code: 'PWR-2024-038', label: 'Fibre Node — Orewa' },
  { code: 'PWR-2024-033', label: 'RBS Swap — Henderson' },
]

export default function PhotosScreen() {
  const [photos, setPhotos] = useLocalStorage<Photo[]>('powertec-photos-v2', [])
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0].code)
  const [showProjectPicker, setShowProjectPicker] = useState(false)
  const [lightbox, setLightbox] = useState<Photo | null>(null)
  const [taking, setTaking] = useState(false)

  const pending = photos.filter(p => p.status === 'pending')
  const uploaded = photos.filter(p => p.status === 'uploaded')

  const currentProject = PROJECTS.find(p => p.code === selectedProject)!

  async function openCamera(source: CameraSource) {
    setTaking(true)
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source,
      })
      if (!image.dataUrl) return

      const now = new Date()
      const newPhoto: Photo = {
        id: `${Date.now()}`,
        dataUrl: image.dataUrl,
        name: `Site photo ${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
        project: selectedProject,
        date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'pending',
      }
      setPhotos(prev => [newPhoto, ...prev])
    } catch (e: any) {
      // User cancelled — not an error
      if (e?.message !== 'User cancelled photos app') {
        console.error('Camera error:', e)
      }
    } finally {
      setTaking(false)
    }
  }

  function deletePhoto(id: string) {
    setPhotos(prev => prev.filter(p => p.id !== id))
    if (lightbox?.id === id) setLightbox(null)
  }

  function markUploaded(id: string) {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, status: 'uploaded' } : p))
  }

  function markAllUploaded() {
    setPhotos(prev => prev.map(p => ({ ...p, status: 'uploaded' })))
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#0d1117]">

      {/* Header */}
      <div
        className="bg-white dark:bg-[#161b22] border-b border-slate-100 dark:border-slate-800 px-5 pb-4 flex-shrink-0"
        style={{ paddingTop: 'max(2.75rem, env(safe-area-inset-top, 0px))' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Site Photos</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {photos.length} photos · {pending.length} pending upload
            </p>
          </div>
        </div>

        {/* Project picker */}
        <button
          onClick={() => setShowProjectPicker(v => !v)}
          className="mt-3 w-full flex items-center justify-between bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 tap-active"
        >
          <div className="text-left min-w-0">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">Tagging photos to</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{currentProject.label}</p>
          </div>
          <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 ml-2 transition-transform ${showProjectPicker ? 'rotate-180' : ''}`} />
        </button>

        {showProjectPicker && (
          <div className="mt-1 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-lg">
            {PROJECTS.map(p => (
              <button
                key={p.code}
                onClick={() => { setSelectedProject(p.code); setShowProjectPicker(false) }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 tap-active border-b last:border-0 border-slate-100 dark:border-slate-800 ${
                  p.code === selectedProject ? 'bg-brand-50 dark:bg-brand-500/10' : ''
                }`}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.code === selectedProject ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-600'}`} />
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${p.code === selectedProject ? 'text-brand-500' : 'text-slate-900 dark:text-white'}`}>{p.label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{p.code}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 scrollable no-scrollbar px-4 py-4 flex flex-col gap-4">

        {/* Camera / Gallery buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => openCamera(CameraSource.Camera)}
            disabled={taking}
            className="bg-brand-500 text-white rounded-2xl p-4 flex flex-col items-center gap-2.5 tap-active disabled:opacity-60 shadow-sm shadow-brand-500/30"
          >
            <CameraIcon size={26} />
            <span className="text-sm font-bold">{taking ? 'Opening…' : 'Take Photo'}</span>
          </button>
          <button
            onClick={() => openCamera(CameraSource.Photos)}
            disabled={taking}
            className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center gap-2.5 tap-active disabled:opacity-60 shadow-sm"
          >
            <FolderOpen size={26} className="text-brand-500" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">From Gallery</span>
          </button>
        </div>

        {/* Pending uploads */}
        {pending.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-amber-500" />
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending Upload</span>
                <span className="bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">{pending.length}</span>
              </div>
              <button
                onClick={markAllUploaded}
                className="text-xs font-semibold text-brand-500 flex items-center gap-1 tap-active"
              >
                <Upload size={12} /> Upload all
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {pending.map(photo => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onTap={() => setLightbox(photo)}
                  onUpload={() => markUploaded(photo.id)}
                  onDelete={() => deletePhoto(photo.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Uploaded */}
        {uploaded.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={13} className="text-green-500" />
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Uploaded</span>
              <span className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">{uploaded.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {uploaded.map(photo => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onTap={() => setLightbox(photo)}
                  onDelete={() => deletePhoto(photo.id)}
                />
              ))}
            </div>
          </section>
        )}

        {photos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <CameraIcon size={28} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No photos yet</p>
            <p className="text-xs text-slate-300 dark:text-slate-600">Tap "Take Photo" to get started</p>
          </div>
        )}

        <div className="h-2" />
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex flex-col"
          onClick={() => setLightbox(null)}
        >
          <div className="flex items-center justify-between px-4 py-4 flex-shrink-0" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))' }}>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{lightbox.name}</p>
              <p className="text-slate-400 text-xs">{lightbox.project} · {lightbox.date}</p>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 ml-3"
            >
              <X size={18} className="text-white" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            <img src={lightbox.dataUrl} alt={lightbox.name} className="max-w-full max-h-full rounded-xl object-contain" />
          </div>
          <div className="px-4 pb-8 flex gap-3 flex-shrink-0" style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 0px))' }} onClick={e => e.stopPropagation()}>
            {lightbox.status === 'pending' && (
              <button
                onClick={() => { markUploaded(lightbox.id); setLightbox(null) }}
                className="flex-1 bg-brand-500 text-white font-bold py-3 rounded-xl tap-active flex items-center justify-center gap-2"
              >
                <Upload size={16} /> Mark Uploaded
              </button>
            )}
            <button
              onClick={() => deletePhoto(lightbox.id)}
              className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center tap-active"
            >
              <Trash2 size={18} className="text-red-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PhotoCard({ photo, onTap, onUpload, onDelete }: {
  photo: Photo
  onTap: () => void
  onUpload?: () => void
  onDelete: () => void
}) {
  const isPending = photo.status === 'pending'
  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-square">
      <button onClick={onTap} className="w-full h-full tap-active">
        <img src={photo.dataUrl} alt={photo.name} className="w-full h-full object-cover" />
      </button>

      {/* Status badge */}
      <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
        isPending
          ? 'bg-amber-500 text-white'
          : 'bg-green-500 text-white'
      }`}>
        {isPending ? <Clock size={9} /> : <CheckCircle size={9} />}
        {isPending ? 'Pending' : 'Uploaded'}
      </div>

      {/* Actions */}
      <div className="absolute top-2 right-2 flex gap-1.5">
        {isPending && onUpload && (
          <button
            onClick={e => { e.stopPropagation(); onUpload() }}
            className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center tap-active"
          >
            <Upload size={13} className="text-white" />
          </button>
        )}
        <button
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="w-7 h-7 bg-black/40 rounded-lg flex items-center justify-center tap-active"
        >
          <Trash2 size={13} className="text-white" />
        </button>
      </div>

      {/* Project tag */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-2">
        <p className="text-[10px] text-white/80 font-mono truncate">{photo.project}</p>
      </div>
    </div>
  )
}
