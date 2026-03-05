import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type ThemeMode = 'dark' | 'light' | 'system'

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<ThemeMode>('powertec-theme', 'dark')

  useEffect(() => {
    const root = document.documentElement
    const applyDark = () => root.classList.add('dark')
    const applyLight = () => root.classList.remove('dark')

    if (theme === 'dark') {
      applyDark()
    } else if (theme === 'light') {
      applyLight()
    } else {
      // system
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.matches ? applyDark() : applyLight()
      const handler = (e: MediaQueryListEvent) => (e.matches ? applyDark() : applyLight())
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [theme])

  return { theme, setTheme }
}
