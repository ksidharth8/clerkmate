'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (saved) {
      setTheme(saved)
      document.documentElement.dataset.theme = saved
    }
  }, [])

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.dataset.theme = next
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 18,
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
