interface AppData {
  productText: string
  additionalTexts: string[]
  imageTexts: string[]
  markupPercent: number
  preferences: Record<string, any>
}

const APP_DATA_KEY = 'marketing_app_data'
const APP_PREFERENCES_KEY = 'marketing_app_preferences'
const APP_HISTORY_KEY = 'marketing_app_history'

export const localStorageService = {
  saveAppData: (data: Partial<AppData>): boolean => {
    try {
      const existing = localStorage.getItem(APP_DATA_KEY)
      const current = existing ? JSON.parse(existing) : {}
      localStorage.setItem(APP_DATA_KEY, JSON.stringify({ ...current, ...data }))
      return true
    } catch (error) {
      console.error('Save error:', error)
      return false
    }
  },

  loadAppData: (): Partial<AppData> => {
    try {
      const data = localStorage.getItem(APP_DATA_KEY)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('Load error:', error)
      return {}
    }
  },

  savePreferences: (preferences: Record<string, any>): boolean => {
    try {
      localStorage.setItem(APP_PREFERENCES_KEY, JSON.stringify(preferences))
      return true
    } catch (error) {
      console.error('Preferences save error:', error)
      return false
    }
  },

  loadPreferences: (): Record<string, any> => {
    try {
      const prefs = localStorage.getItem(APP_PREFERENCES_KEY)
      return prefs ? JSON.parse(prefs) : {}
    } catch (error) {
      console.error('Preferences load error:', error)
      return {}
    }
  },

  addToHistory: (item: any): boolean => {
    try {
      const existing = localStorage.getItem(APP_HISTORY_KEY)
      const history = existing ? JSON.parse(existing) : []
      history.unshift({ ...item, timestamp: new Date().toISOString() })
      // Keep only last 50 items
      localStorage.setItem(APP_HISTORY_KEY, JSON.stringify(history.slice(0, 50)))
      return true
    } catch (error) {
      console.error('History add error:', error)
      return false
    }
  },

  getHistory: (): any[] => {
    try {
      const history = localStorage.getItem(APP_HISTORY_KEY)
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.error('History load error:', error)
      return []
    }
  },

  clearAll: (): boolean => {
    try {
      localStorage.removeItem(APP_DATA_KEY)
      localStorage.removeItem(APP_PREFERENCES_KEY)
      localStorage.removeItem(APP_HISTORY_KEY)
      return true
    } catch (error) {
      console.error('Clear error:', error)
      return false
    }
  },
}
