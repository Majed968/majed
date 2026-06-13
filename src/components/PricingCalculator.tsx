import React, { useState } from 'react'
import { DollarSign, Plus, Minus, Trash2, Save } from 'lucide-react'

interface Currency {
  id: string
  name: string
  code: string
  symbol: string
  markup: number
  exchangeRate: number
}

interface PricingCalculatorProps {
  onMarkupChange: (markup: number) => void
  currentMarkup: number
}

export default function PricingCalculator({ onMarkupChange, currentMarkup }: PricingCalculatorProps) {
  const [currencies, setCurrencies] = useState<Currency[]>([
    {
      id: '1',
      name: 'ريال يمني (قديم)',
      code: 'YER_OLD',
      symbol: 'ر.ي',
      markup: currentMarkup,
      exchangeRate: 1,
    },
    {
      id: '2',
      name: 'ريال يمني (جديد)',
      code: 'YER_NEW',
      symbol: 'ر.ي',
      markup: currentMarkup,
      exchangeRate: 1,
    },
    {
      id: '3',
      name: 'ريال سعودي',
      code: 'SAR',
      symbol: 'ر.س',
      markup: currentMarkup,
      exchangeRate: 0.0019,
    },
    {
      id: '4',
      name: 'دولار',
      code: 'USD',
      symbol: '$',
      markup: currentMarkup,
      exchangeRate: 0.004,
    },
  ])
  const [newCurrencyName, setNewCurrencyName] = useState('')
  const [newCurrencyCode, setNewCurrencyCode] = useState('')
  const [newCurrencyRate, setNewCurrencyRate] = useState('1')

  const updateCurrency = (id: string, updates: Partial<Currency>) => {
    setCurrencies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    )
  }

  const updateAllMarkups = (markup: number) => {
    setCurrencies((prev) =>
      prev.map((c) => ({ ...c, markup }))
    )
    onMarkupChange(markup)
  }

  const addCurrency = () => {
    if (!newCurrencyName.trim() || !newCurrencyCode.trim()) {
      alert('الرجاء ملء جميع الحقول')
      return
    }

    const newCurrency: Currency = {
      id: Date.now().toString(),
      name: newCurrencyName,
      code: newCurrencyCode,
      symbol: newCurrencyCode,
      markup: currentMarkup,
      exchangeRate: parseFloat(newCurrencyRate),
    }

    setCurrencies([...currencies, newCurrency])
    setNewCurrencyName('')
    setNewCurrencyCode('')
    setNewCurrencyRate('1')
  }

  const deleteCurrency = (id: string) => {
    if (currencies.length > 1) {
      setCurrencies((prev) => prev.filter((c) => c.id !== id))
    }
  }

  const calculatePrice = (basePrice: number, markup: number, exchangeRate: number): number => {
    return Math.round(basePrice * (1 + markup / 100) * exchangeRate)
  }

  // Example calculation
  const exampleBase = 1000

  return (
    <div className="space-y-6">
      {/* Global Markup Control */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 تحكم النسبة المئوية العام</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">نسبة الزيادة (%)</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateAllMarkups(Math.max(0, currentMarkup - 5))}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                <Minus size={20} />
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={currentMarkup}
                onChange={(e) => updateAllMarkups(parseInt(e.target.value))}
                className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <button
                onClick={() => updateAllMarkups(Math.min(100, currentMarkup + 5))}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <Plus size={20} />
              </button>
              <div className="text-center min-w-20">
                <div className="text-3xl font-bold text-blue-600">{currentMarkup}%</div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">📊 معاينة حسابية (السعر الأساسي: {exampleBase})</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {currencies.map((currency) => (
                <div key={currency.id} className="bg-gray-50 p-3 rounded text-center">
                  <p className="text-xs text-gray-600">{currency.code}</p>
                  <p className="text-lg font-bold text-blue-600">
                    {calculatePrice(exampleBase, currentMarkup, currency.exchangeRate)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{currency.symbol}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Currencies Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💱 إدارة العملات</h3>
        
        <div className="space-y-4">
          {/* Add New Currency */}
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
            <p className="text-sm font-medium text-gray-700 mb-3">➕ إضافة عملة جديدة</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={newCurrencyName}
                onChange={(e) => setNewCurrencyName(e.target.value)}
                placeholder="اسم العملة"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="text"
                value={newCurrencyCode}
                onChange={(e) => setNewCurrencyCode(e.target.value)}
                placeholder="رمز العملة"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="number"
                value={newCurrencyRate}
                onChange={(e) => setNewCurrencyRate(e.target.value)}
                placeholder="سعر الصرف"
                step="0.0001"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={addCurrency}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
              >
                إضافة
              </button>
            </div>
          </div>

          {/* Currencies List */}
          <div className="space-y-3">
            {currencies.map((currency) => (
              <div
                key={currency.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="font-medium text-gray-900">{currency.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{currency.code}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">سعر الصرف</label>
                    <input
                      type="number"
                      value={currency.exchangeRate}
                      onChange={(e) =>
                        updateCurrency(currency.id, {
                          exchangeRate: parseFloat(e.target.value),
                        })
                      }
                      step="0.0001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 block mb-1">النسبة (%)</label>
                    <input
                      type="number"
                      value={currency.markup}
                      onChange={(e) =>
                        updateCurrency(currency.id, {
                          markup: parseInt(e.target.value),
                        })
                      }
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-600 mb-1">السعر النهائي</p>
                    <p className="text-lg font-bold text-green-600">
                      {calculatePrice(exampleBase, currency.markup, currency.exchangeRate)} {currency.symbol}
                    </p>
                  </div>

                  <div className="flex justify-end gap-2">
                    {currencies.length > 1 && (
                      <button
                        onClick={() => deleteCurrency(currency.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
