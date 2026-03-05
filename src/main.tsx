import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import BrowserBlock from './components/BrowserBlock'
import './styles/globals.css'
import { registerSW } from './utils/registerSW'

registerSW()

// Detect if running inside Capacitor (Android app) or a plain browser
const isNative = !!(window as any).Capacitor?.isNativePlatform?.()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isNative ? <App /> : <BrowserBlock />}
  </React.StrictMode>
)
