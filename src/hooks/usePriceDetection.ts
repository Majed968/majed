import { useState, useCallback } from 'react'

interface Price {
  original: string
  amount: number
  currency: string
  index: number
}

const PRICE_PATTERNS = [
  { pattern: /(?:السعر|سعر|Price)[\s:]*([\d,]+)\s*(?:ريال|YER|ر\.ع)/gi, currency: 'YER' },
  { pattern: /(?:السعر|سعر|Price)[\s:]*([\d,]+)\s*(?:SAR|ر\.س)/gi, currency: 'SAR' },
  { pattern: /([\d,]+)\s*(?:ألف\s*)?(?:ريال|YER|ر\.ع)/gi, currency: 'YER' },
  { pattern: /([\d,]+)\s*(?:SAR|ر\.س)/gi, currency: 'SAR' },
  { pattern: /\$\s*([\d,]+)/g, currency: 'USD' },
  { pattern: /([\d,]+)\s*ريال\s*سعودي/gi, currency: 'SAR' },
  { pattern: /بسعر\s*([\d,]+)/gi, currency: 'YER' },
  { pattern: /\b([\d,]+)\s*(?:ريال|درهم)/gi, currency: 'YER' },
]

export const usePriceDetection = () => {
  const [detectedPrices, setDetectedPrices] = useState<Price[]>([])

  const detectPrices = useCallback((text: string): Price[] => {
    const prices: Price[] = []
    const seen = new Set<string>()

    PRICE_PATTERNS.forEach(({ pattern, currency }) => {
      let match
      while ((match = pattern.exec(text)) !== null) {
        const amountStr = match[1].replace(/,/g, '')
        const amount = parseFloat(amountStr)
        
        if (!isNaN(amount) && amount > 0) {
          const key = `${amount}-${currency}`
          if (!seen.has(key)) {
            prices.push({
              original: match[0],
              amount,
              currency,
              index: match.index,
            })
            seen.add(key)
          }
        }
      }
    })

    setDetectedPrices(prices.sort((a, b) => a.index - b.index))
    return prices
  }, [])

  const applyMarkup = useCallback((text: string, prices: Price[], markupPercent: number): string => {
    let result = text
    const sortedPrices = [...prices].reverse() // Process from end to avoid index shifting

    sortedPrices.forEach(price => {
      const newAmount = Math.round(price.amount * (1 + markupPercent / 100))
      const newPriceText = price.original.replace(
        price.amount.toString(),
        newAmount.toString()
      )
      result = result.replace(price.original, newPriceText)
    })

    return result
  }, [])

  const convertCurrency = useCallback((amount: number, from: string, to: string): number => {
    const rates: Record<string, Record<string, number>> = {
      'YER': { 'SAR': 0.0019, 'USD': 0.004 },
      'SAR': { 'YER': 526.3, 'USD': 0.266 },
      'USD': { 'YER': 250, 'SAR': 3.75 },
    }

    if (from === to) return amount
    return Math.round(amount * (rates[from]?.[to] || 1) * 100) / 100
  }, [])

  return {
    detectedPrices,
    detectPrices,
    applyMarkup,
    convertCurrency,
  }
}
