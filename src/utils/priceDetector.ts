export interface DetectedPrice {
  original: string
  amount: number
  currency: string
  position: number
}

const COMPREHENSIVE_PATTERNS = [
  // Arabic patterns
  { pattern: /السعر\s*[:\s]*([\d,]+)\s*(?:ريال|YER)/gi, currency: 'YER' },
  { pattern: /سعر\s*[:\s]*([\d,]+)\s*(?:ريال|YER)/gi, currency: 'YER' },
  { pattern: /ب\s*([\d,]+)\s*ريال\s*يمني/gi, currency: 'YER' },
  { pattern: /([\d,]+)\s*ألف\s*ريال/gi, currency: 'YER' },
  
  // Saudi Riyal patterns
  { pattern: /([\d,]+)\s*(?:ريال\s*)?سعودي/gi, currency: 'SAR' },
  { pattern: /([\d,]+)\s*SAR/gi, currency: 'SAR' },
  { pattern: /ب\s*([\d,]+)\s*ريال\s*سعودي/gi, currency: 'SAR' },
  
  // Dollar patterns
  { pattern: /\$\s*([\d,]+)/g, currency: 'USD' },
  { pattern: /([\d,]+)\s*(?:دولار|USD)/gi, currency: 'USD' },
  
  // Generic number patterns
  { pattern: /\b([\d,]{3,})\b/g, currency: 'UNKNOWN' },
]

export const detectAllPrices = (text: string): DetectedPrice[] => {
  const prices: DetectedPrice[] = []
  const seen = new Set<string>()

  COMPREHENSIVE_PATTERNS.forEach(({ pattern, currency }) => {
    let match
    pattern.lastIndex = 0 // Reset regex
    
    while ((match = pattern.exec(text)) !== null) {
      const amountStr = match[1].replace(/,/g, '')
      const amount = parseFloat(amountStr)
      
      if (!isNaN(amount) && amount > 0 && amount < 10000000) {
        const key = `${amount}-${currency}-${match.index}`
        if (!seen.has(key)) {
          prices.push({
            original: match[0],
            amount,
            currency,
            position: match.index,
          })
          seen.add(key)
        }
      }
    }
  })

  return prices.sort((a, b) => a.position - b.position)
}

export const formatPrice = (amount: number, currency: string): string => {
  const formatted = new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency === 'SAR' ? 'SAR' : 'USD',
  }).format(amount)

  if (currency === 'YER') {
    return `${amount.toLocaleString('ar-SA')} ريال يمني`
  }
  return formatted
}

export const applyMarkupToPrices = (
  text: string,
  prices: DetectedPrice[],
  markupPercent: number
): string => {
  let result = text
  
  // Sort prices in reverse order to avoid position shifts
  const sortedPrices = [...prices].reverse()
  
  sortedPrices.forEach(price => {
    const newAmount = Math.round(price.amount * (1 + markupPercent / 100))
    const newPriceString = price.original.replace(
      price.amount.toString(),
      newAmount.toString()
    )
    result = result.replace(price.original, newPriceString)
  })

  return result
}
