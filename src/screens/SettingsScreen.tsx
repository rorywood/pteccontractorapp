import { useState } from 'react'
import {
  RefreshCw, Loader2, Trash2, AlertTriangle, Info,
  LogOut, Bell, CheckCircle, WifiOff, XCircle, Moon, Sun,
} from 'lucide-react'
import type { CheckResult } from '../hooks/useAppUpdater'
import { CURRENT_VERSION } from '../hooks/useAppUpdater'
import { useTheme } from '../context/ThemeContext'

interface Props {
  lastChecked: Date | null
  checking: boolean
  checkResult: CheckResult
  onCheckForUpdate: () => Promise<CheckResult>
}

export default function SettingsScreen({ lastChecked, checking, checkResult, onCheckForUpdate }: Props) {
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const clearAllData = () => {
    localStorage.clear()
    setShowClearConfirm(false)
    setTimeout(() => window.location.reload(), 500)
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-[#0d1117]">
      <div
        className="bg-white dark:bg-[#161b22] border-b border-slate-100 dark:border-slate-800 px-5 pb-4 flex-shrink-0"
        style={{ paddingTop: 'max(2.75rem, env(safe-area-inset-top, 0px))' }}
      >
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h1>
      </div>

      <div className="flex-1 scrollable no-scrollbar px-4 py-4 flex flex-col gap-4">

        {/* Account */}
        <Section title="Account">
          <div className="px-4 py-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
              JT
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">James Thornton</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">james@example.com</p>
            </div>
          </div>
          <Divider />
          <ToggleRow
            icon={Bell}
            label="Notifications"
            value={true}
            onChange={() => {}}
          />
        </Section>

        {/* Appearance */}
        <Section title="Appearance">
          <ToggleRow
            icon={theme === 'dark' ? Moon : Sun}
            label="Dark Mode"
            value={theme === 'dark'}
            onChange={toggleTheme}
          />
        </Section>

        {/* App Update */}
        <Section title="App Update">
          <div className="px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Powertec Contractor App</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {lastChecked
                  ? `Last checked ${lastChecked.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
                  : 'Not checked yet'}
              </p>
            </div>
            <span className="bg-brand-50 dark:bg-brand-500/10 text-brand-500 text-xs font-bold px-3 py-1.5 rounded-full border border-brand-100 dark:border-brand-500/20">
              v{CURRENT_VERSION}
            </span>
          </div>

          {checkResult && (
            <>
              <Divider />
              <div className={`mx-4 my-3 flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium ${
                checkResult === 'up-to-date'       ? 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900' :
                checkResult === 'update-available' ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900' :
                checkResult === 'offline'          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900' :
                                                     'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900'
              }`}>
                {checkResult === 'up-to-date'       && <CheckCircle size={16} className="text-green-500 flex-shrink-0" />}
                {checkResult === 'update-available' && <RefreshCw   size={16} className="text-blue-500 flex-shrink-0" />}
                {checkResult === 'offline'          && <WifiOff     size={16} className="text-amber-500 flex-shrink-0" />}
                {checkResult === 'error'            && <XCircle     size={16} className="text-red-500 flex-shrink-0" />}
                <span className="text-sm">
                  {checkResult === 'up-to-date'       && "You're on the latest version"}
                  {checkResult === 'update-available' && 'Update available — see banner above'}
                  {checkResult === 'offline'          && 'No internet — connect to check for updates'}
                  {checkResult === 'error'            && 'Could not reach update server'}
                </span>
              </div>
            </>
          )}

          <Divider />
          <div className="px-4 py-3">
            <button
              onClick={onCheckForUpdate}
              disabled={checking}
              className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-xl tap-active disabled:opacity-60 text-sm"
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
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl p-3">
                  <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 dark:text-red-400 leading-snug">
                    This will delete all locally stored data. This cannot be undone.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={clearAllData} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl tap-active text-sm">
                    Clear all
                  </button>
                  <button onClick={() => setShowClearConfirm(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-xl tap-active text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-500 font-semibold py-3 rounded-xl tap-active text-sm"
              >
                <Trash2 size={15} /> Clear local data
              </button>
            )}
          </div>
        </Section>

        {/* About */}
        <Section title="About">
          <div className="px-4 py-4 flex items-start gap-2">
            <Info size={13} className="text-slate-300 dark:text-slate-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Powertec Telecommunications contractor field app. All navigation works offline.
              Project data and file uploads require an internet connection.
            </p>
          </div>
        </Section>

        {/* Sign out */}
        <button className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-center gap-2 text-red-500 font-semibold text-sm tap-active shadow-sm">
          <LogOut size={16} /> Sign Out
        </button>

        <div className="h-2" />
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1 mb-2">{title}</p>
      <div className="bg-white dark:bg-[#161b22] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-slate-100 dark:bg-slate-800 mx-4" />
}

function ToggleRow({ icon: Icon, label, value, onChange }: {
  icon: typeof Bell
  label: string
  value: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-slate-400 dark:text-slate-500" />
        <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
          value ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'
        }`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          value ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </button>
    </div>
  )
}
