import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import BrowserBlock from './components/BrowserBlock'
import './styles/globals.css'
import { registerSW } from './utils/registerSW'
import { ThemeProvider } from './context/ThemeContext'

registerSW()

// Detect if running inside Capacitor (Android app) or a plain browser
const isNative = !!(window as any).Capacitor?.isNativePlatform?.()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      {isNative ? <App /> : <BrowserBlock />}
    </ThemeProvider>
  </React.StrictMode>
)
