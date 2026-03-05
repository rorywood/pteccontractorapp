import { Camera, Upload, Image, Clock, FolderOpen, Plus } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface Photo {
  id: string
  name: string
  project: string
  date: string
  status: 'uploaded' | 'pending'
}

const MOCK_PHOTOS: Photo[] = [
  { id: '1', name: 'Site arrival — Silverdale', project: 'PWR-2024-041', date: '28 Feb 2025', status: 'uploaded' },
  { id: '2', name: 'Antenna mount before', project: 'PWR-2024-041', date: '28 Feb 2025', status: 'uploaded' },
  { id: '3', name: 'Cable routing detail', project: 'PWR-2024-041', date: '28 Feb 2025', status: 'pending' },
]

export default function PhotosScreen() {
  const [photos] = useLocalStorage<Photo[]>('powertec-photos', MOCK_PHOTOS)

  const pending = photos.filter(p => p.status === 'pending')
  const uploaded = photos.filter(p => p.status === 'uploaded')

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-slate-100 px-4 pb-4 flex-shrink-0" style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top, 0px))' }}>
        <h1 className="text-xl font-bold text-slate-900">Site Photos</h1>
        <p className="text-xs text-slate-400 mt-0.5">{photos.length} photos total · {pending.length} pending upload</p>
      </div>

      <div className="flex-1 scrollable no-scrollbar px-4 py-4 flex flex-col gap-4">

        {/* Upload button */}
        <button className="w-full card p-5 flex flex-col items-center gap-3 tap-active border-dashed border-2 border-brand-200 bg-brand-50">
          <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center">
            <Camera size={22} className="text-white" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-brand-600">Take or Upload Photos</p>
            <p className="text-xs text-brand-400 mt-0.5">Photos will be saved to the project folder on SharePoint</p>
          </div>
        </button>

        {/* Pending uploads */}
        {pending.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-sm font-bold text-slate-900">Pending Upload</h2>
              <span className="badge bg-amber-50 text-amber-700">{pending.length}</span>
            </div>
            <div className="card overflow-hidden">
              {pending.map((photo, i) => (
                <div key={photo.id} className={`flex items-center gap-3 px-4 py-3.5 ${i < pending.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Image size={18} className="text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{photo.name}</p>
                    <p className="text-xs text-slate-400">{photo.project} · {photo.date}</p>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-semibold text-brand-500 tap-active">
                    <Upload size={13} /> Upload
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-2 w-full py-3 bg-brand-500 text-white font-semibold text-sm rounded-xl tap-active flex items-center justify-center gap-2">
              <Upload size={16} /> Upload All Pending
            </button>
          </section>
        )}

        {/* Uploaded */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-sm font-bold text-slate-900">Uploaded</h2>
            <span className="badge bg-green-50 text-green-700">{uploaded.length}</span>
          </div>
          {uploaded.length > 0 ? (
            <div className="card overflow-hidden">
              {uploaded.map((photo, i) => (
                <div key={photo.id} className={`flex items-center gap-3 px-4 py-3.5 ${i < uploaded.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Image size={18} className="text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{photo.name}</p>
                    <p className="text-xs text-slate-400">{photo.project} · {photo.date}</p>
                  </div>
                  <span className="badge bg-green-50 text-green-600 text-xs">Saved</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <FolderOpen size={28} className="text-slate-200" />
              <p className="text-sm text-slate-400">No photos uploaded yet</p>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
