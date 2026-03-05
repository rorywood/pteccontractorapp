import { useState } from 'react'
import {
  RefreshCw, Loader2, Trash2, AlertTriangle, Info,
  LogOut, User, Bell, CheckCircle, WifiOff, XCircle, ChevronRight,
} from 'lucide-react'
import type { CheckResult } from '../hooks/useAppUpdater'
import { CURRENT_VERSION } from '../hooks/useAppUpdater'

interface Props {
  lastChecked: Date | null
  checking: boolean
  checkResult: CheckResult
  onCheckForUpdate: () => Promise<CheckResult>
}

export default function SettingsScreen({ lastChecked, checking, checkResult, onCheckForUpdate }: Props) {
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const clearAllData = () => {
    localStorage.clear()
    setShowClearConfirm(false)
    setTimeout(() => window.location.reload(), 500)
  }

  return (
    <div className="h-full flex flex-col">
      <div
        className="bg-white border-b border-slate-100 px-4 pb-4 flex-shrink-0"
        style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top, 0px))' }}
      >
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
      </div>

      <div className="flex-1 scrollable no-scrollbar px-4 py-4 flex flex-col gap-4">

        {/* Profile */}
        <Section title="Account">
          <div className="px-4 py-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
              JT
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">James Thornton</p>
              <p className="text-xs text-slate-400">james@example.com</p>
            </div>
          </div>
          <Divider />
          <ActionRow icon={User} label="Edit Profile" />
          <Divider />
          <ActionRow icon={Bell} label="Notifications" />
        </Section>

        {/* App Update */}
        <Section title="App Update">
          {/* Version badge */}
          <div className="px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Powertec Contractor App</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {lastChecked
                  ? `Last checked ${lastChecked.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
                  : 'Not checked yet'}
              </p>
            </div>
            <span className="bg-brand-50 text-brand-500 text-xs font-bold px-3 py-1.5 rounded-full border border-brand-100">
              v{CURRENT_VERSION}
            </span>
          </div>

          <Divider />

          {/* Check result feedback */}
          {checkResult && checkResult !== null && (
            <>
              <div className={`mx-4 my-3 flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium ${
                checkResult === 'up-to-date'       ? 'bg-green-50 text-green-700 border border-green-200' :
                checkResult === 'update-available' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                checkResult === 'offline'          ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                     'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {checkResult === 'up-to-date'       && <CheckCircle size={16} className="text-green-500 flex-shrink-0" />}
                {checkResult === 'update-available' && <RefreshCw   size={16} className="text-blue-500 flex-shrink-0" />}
                {checkResult === 'offline'          && <WifiOff     size={16} className="text-amber-500 flex-shrink-0" />}
                {checkResult === 'error'            && <XCircle     size={16} className="text-red-500 flex-shrink-0" />}
                <span>
                  {checkResult === 'up-to-date'       && 'You\'re on the latest version'}
                  {checkResult === 'update-available' && 'Update available — see banner above'}
                  {checkResult === 'offline'          && 'No internet connection — connect to Wi-Fi to check for updates'}
                  {checkResult === 'error'            && 'Could not reach update server'}
                </span>
              </div>
              <Divider />
            </>
          )}

          <div className="px-4 py-3">
            <button
              onClick={onCheckForUpdate}
              disabled={checking}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-semibold py-3 rounded-xl tap-active disabled:opacity-60 text-sm"
            >
              {checking
                ? <><Loader2 size={15} className="animate-spin" /> Checking...</>
                : <><RefreshCw size={15} /> Check for updates</>
              }
            </button>
          </div>
        </Section>

        {/* Data */}
        <Section title="Data">
          <div className="px-4 py-3">
            {showClearConfirm ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 leading-snug">
                    This will delete all locally stored data. This cannot be undone.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={clearAllData} className="flex-1 bg-red-500 text-white font-bold py-2.5 rounded-xl tap-active text-sm">
                    Clear all
                  </button>
                  <button onClick={() => setShowClearConfirm(false)} className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-xl tap-active text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-500 font-semibold py-3 rounded-xl tap-active text-sm"
              >
                <Trash2 size={15} /> Clear local data
              </button>
            )}
          </div>
        </Section>

        {/* About */}
        <Section title="About">
          <div className="px-4 py-4 flex items-start gap-2">
            <Info size={13} className="text-slate-300 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Powertec Telecommunications contractor field app. All navigation works offline.
              Project data and file uploads require an internet connection.
            </p>
          </div>
        </Section>

        {/* Sign out */}
        <button className="card p-4 flex items-center justify-center gap-2 text-red-500 font-semibold text-sm tap-active">
          <LogOut size={16} /> Sign Out
        </button>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1 mb-2">{title}</p>
      <div className="card overflow-hidden">{children}</div>
    </div>
  )
}

function ActionRow({ icon: Icon, label }: { icon: typeof User; label: string }) {
  return (
    <button className="w-full flex items-center justify-between px-4 py-3.5 tap-active">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-slate-400" />
        <span className="text-sm text-slate-700">{label}</span>
      </div>
      <ChevronRight size={14} className="text-slate-300" />
    </button>
  )
}

function Divider() {
  return <div className="h-px bg-slate-100 mx-4" />
}
