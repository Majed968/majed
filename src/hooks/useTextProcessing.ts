import { useState, useCallback } from 'react'

interface TextOptions {
  addEmojis: boolean
  autoFormat: boolean
  colorizeLines: boolean
  suggestMarketing: boolean
}

const MARKETING_PHRASES = [
  'منتج ممتاز وراقي',
  'جودة عالية جداً',
  'سعر مميز جداً',
  'عرض حصري محدود',
  'توفر كبيرة للمشترين',
  'جودة فاخرة بسعر مناسب',
  'أفضل عرض في السوق',
  'منتج موثو�� وأصلي',
  'شحن سريع ومجاني',
  'ضمان كامل للمنتج',
]

const EMOJI_MAP: Record<string, string> = {
  'هاتف': '📞',
  'واتس': '💬',
  'توصيل': '🚚',
  'شحن': '📦',
  'ضمان': '✅',
  'عرض': '🎁',
  'سعر': '💰',
  'جودة': '⭐',
  'دفع': '💳',
  'عنوان': '📍',
}

export const useTextProcessing = () => {
  const [processedText, setProcessedText] = useState('')

  const addEmojis = useCallback((text: string): string => {
    let result = text
    Object.entries(EMOJI_MAP).forEach(([word, emoji]) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      result = result.replace(regex, `${emoji} ${word}`)
    })
    return result
  }, [])

  const formatText = useCallback((text: string): string => {
    // Add spacing between paragraphs
    let formatted = text.replace(/([.!?])([^\s])/g, '$1\n$2')
    // Remove extra spaces
    formatted = formatted.replace(/\s{2,}/g, ' ')
    return formatted.trim()
  }, [])

  const colorizeLines = useCallback((text: string): string[] => {
    const lines = text.split('\n')
    const colors = ['text-blue-600', 'text-purple-600', 'text-green-600', 'text-red-600', 'text-pink-600']
    return lines.map((line, idx) => `<span class="${colors[idx % colors.length]}">${line}</span>`)
  }, [])

  const generateMarketingSuggestions = useCallback((text: string): string[] => {
    const suggestions: string[] = []
    const randomPhrases = MARKETING_PHRASES.sort(() => 0.5 - Math.random()).slice(0, 3)
    return [...randomPhrases, ...suggestions]
  }, [])

  const processText = useCallback((text: string, options: TextOptions): string => {
    let result = text

    if (options.autoFormat) {
      result = formatText(result)
    }

    if (options.addEmojis) {
      result = addEmojis(result)
    }

    setProcessedText(result)
    return result
  }, [formatText, addEmojis])

  return {
    processedText,
    processText,
    addEmojis,
    formatText,
    colorizeLines,
    generateMarketingSuggestions,
  }
}
