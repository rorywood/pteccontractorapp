import { useState, useCallback } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppUpdater } from './hooks/useAppUpdater'
import BottomNav from './components/BottomNav'
import AppUpdatePrompt from './components/AppUpdatePrompt'
import SplashScreen from './components/SplashScreen'
import HomeScreen from './screens/HomeScreen'
import ProjectsScreen from './screens/ProjectsScreen'
import ChecklistScreen from './screens/ChecklistScreen'
import PhotosScreen from './screens/PhotosScreen'
import SettingsScreen from './screens/SettingsScreen'

export default function App() {
  const updater = useAppUpdater()
  const [splashDone, setSplashDone] = useState(false)
  const handleSplashDone = useCallback(() => setSplashDone(true), [])

  return (
    <>
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}
    <HashRouter>
      <div className="flex flex-col h-full bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-slate-100">

        {/* In-app APK update banner */}
        {updater.updateAvailable && updater.updateInfo && (
          <AppUpdatePrompt
            info={updater.updateInfo}
            onDismiss={updater.dismiss}
            onInstall={updater.downloadAndInstall}
            downloadState={updater.downloadState}
            downloadProgress={updater.downloadProgress}
          />
        )}

        <main className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/"          element={<HomeScreen />} />
            <Route path="/projects"  element={<ProjectsScreen />} />
            <Route path="/checklist" element={<ChecklistScreen />} />
            <Route path="/photos"    element={<PhotosScreen />} />
            <Route path="/settings"  element={
              <SettingsScreen
                lastChecked={updater.lastChecked}
                checking={updater.checking}
                checkResult={updater.checkResult}
                onCheckForUpdate={updater.checkForUpdate}
              />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </HashRouter>
    </>
  )
}
