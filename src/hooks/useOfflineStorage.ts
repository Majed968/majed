import { useState, useEffect, useCallback } from 'react'

interface StorageData {
  productText: string
  additionalTexts: string[]
  imageTexts: string[]
  markupPercent: number
  preferences: Record<string, any>
}

const STORAGE_KEY = 'marketing_app_data'
const PREFERENCES_KEY = 'marketing_app_preferences'

export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [data, setData] = useState<Partial<StorageData>>({})

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const saveData = useCallback((newData: Partial<StorageData>) => {
    try {
      const merged = { ...data, ...newData }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      setData(merged)
      return true
    } catch (error) {
      console.error('Storage error:', error)
      return false
    }
  }, [data])

  const loadData = useCallback((): Partial<StorageData> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const loaded = stored ? JSON.parse(stored) : {}
      setData(loaded)
      return loaded
    } catch (error) {
      console.error('Load error:', error)
      return {}
    }
  }, [])

  const savePreferences = useCallback((prefs: Record<string, any>) => {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs))
      return true
    } catch (error) {
      console.error('Preferences save error:', error)
      return false
    }
  }, [])

  const loadPreferences = useCallback((): Record<string, any> => {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Preferences load error:', error)
      return {}
    }
  }, [])

  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setData({})
      return true
    } catch (error) {
      console.error('Clear error:', error)
      return false
    }
  }, [])

  return {
    isOnline,
    data,
    saveData,
    loadData,
    savePreferences,
    loadPreferences,
    clearData,
  }
}
