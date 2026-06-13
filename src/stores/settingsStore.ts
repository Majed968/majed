import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CurrencyRate {
  name: string
  code: string
  markup: number
}

interface SettingsState {
  markupPercent: number
  setMarkupPercent: (percent: number) => void
  
  currencies: CurrencyRate[]
  addCurrency: (currency: CurrencyRate) => void
  removeCurrency: (code: string) => void
  updateCurrencyMarkup: (code: string, markup: number) => void
  
  autoFormat: boolean
  setAutoFormat: (value: boolean) => void
  
  addEmojis: boolean
  setAddEmojis: (value: boolean) => void
  
  colorizeLines: boolean
  setColorizeLines: (value: boolean) => void
  
  suggestMarketing: boolean
  setSuggestMarketing: (value: boolean) => void
}

const defaultCurrencies: CurrencyRate[] = [
  { name: 'يمني قديم', code: 'YER_OLD', markup: 0 },
  { name: 'يمني جديد', code: 'YER_NEW', markup: 0 },
  { name: 'سعودي', code: 'SAR', markup: 0 },
]

export const useSettingsStore = create<SettingsState>(
  persist(
    (set) => ({
      markupPercent: 10,
      setMarkupPercent: (percent) => set({ markupPercent: percent }),
      
      currencies: defaultCurrencies,
      addCurrency: (currency) => set((state) => ({
        currencies: [...state.currencies, currency],
      })),
      removeCurrency: (code) => set((state) => ({
        currencies: state.currencies.filter((c) => c.code !== code),
      })),
      updateCurrencyMarkup: (code, markup) => set((state) => ({
        currencies: state.currencies.map((c) =>
          c.code === code ? { ...c, markup } : c
        ),
      })),
      
      autoFormat: true,
      setAutoFormat: (value) => set({ autoFormat: value }),
      
      addEmojis: true,
      setAddEmojis: (value) => set({ addEmojis: value }),
      
      colorizeLines: true,
      setColorizeLines: (value) => set({ colorizeLines: value }),
      
      suggestMarketing: true,
      setSuggestMarketing: (value) => set({ suggestMarketing: value }),
    }),
    {
      name: 'marketing-app-settings',
    }
  )
)
