import React, { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface PriceDetectorProps {
  text: string
  onProcessed: (text: string) => void
}

export default function PriceDetector({ text, onProcessed }: PriceDetectorProps) {
  const [detectedPrices, setDetectedPrices] = useState<any[]>([])
  const [markup, setMarkup] = useState(10)

  const detectPrices = (text: string) => {
    // Advanced price detection regex patterns
    const patterns = [
      /السعر\s*[:\s]*([\d,]+)\s*(?:ريال|الف)?/gi,
      /سعر\s*[:\s]*([\d,]+)/gi,
      /([\d,]+)\s*(?:ريال|يمني)/gi,
      /\$([\d,]+)/g,
      /([\d,]+)\s*SAR/gi,
      /([\d,]+)\s*YER/gi,
    ]

    const prices = []
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(text)) !== null) {
        prices.push({
          original: match[0],
          amount: parseFloat(match[1].replace(/,/g, '')),
          currency: determineCurrency(match[0]),
        })
      }
    }

    return prices
  }

  const determineCurrency = (text: string): string => {
    if (text.includes('SAR') || text.includes('ريال')) return 'SAR'
    if (text.includes('YER') || text.includes('يمني')) return 'YER'
    if (text.includes('$')) return 'USD'
    return 'YER'
  }

  const applyMarkup = (prices: any[]) => {
    let result = text
    prices.forEach(price => {
      const newPrice = Math.round(price.amount * (1 + markup / 100))
      const newText = `${price.original.split(price.amount)[0]}${newPrice}${price.original.split(price.amount)[1] || ''}`
      result = result.replace(price.original, newText)
    })
    return result
  }

  useEffect(() => {
    if (text.trim()) {
      const prices = detectPrices(text)
      setDetectedPrices(prices)
      onProcessed(applyMarkup(prices))
    }
  }, [text, markup])

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 كشف الأسعار</h3>

      {/* Markup Control */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">نسبة الزيادة %</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="50"
            value={markup}
            onChange={(e) => setMarkup(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-lg font-bold text-blue-600 min-w-12">{markup}%</span>
        </div>
      </div>

      {/* Detected Prices */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">الأسعار المكتشفة:</h4>
        {detectedPrices.length > 0 ? (
          <div className="space-y-2">
            {detectedPrices.map((price, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-green-50 p-2 rounded border border-green-200">
                <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium text-gray-900">{price.original}</p>
                  <p className="text-gray-600">ج��يد: {Math.round(price.amount * (1 + markup / 100))} {price.currency}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-start gap-2 text-gray-600 p-2">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">لم يتم العثور على أسعار</p>
          </div>
        )}
      </div>
    </div>
  )
}
