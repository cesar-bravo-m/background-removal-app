'use client'
import { useState, useEffect } from 'react'
import { translations } from '../translations'

interface Props {
  language: 'en' | 'es'
}

export default function CookieConsent({ language }: Props) {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookieConsent')
    if (!hasConsented) {
      setShowConsent(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true')
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-24 left-0 right-0 px-4 py-3 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300 text-center sm:text-left">
          {translations[language].cookieConsent}
        </p>
        <button
          onClick={acceptCookies}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg 
                   transition-colors flex-shrink-0 text-sm font-medium"
        >
          {translations[language].accept}
        </button>
      </div>
    </div>
  )
} 