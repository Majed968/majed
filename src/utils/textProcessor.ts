export const formatTextWithSpacing = (text: string): string => {
  // Add line breaks after sentences
  let formatted = text.replace(/([.!?؟])\s*/g, '$1\n\n')
  // Remove excessive whitespace
  formatted = formatted.replace(/\n{3,}/g, '\n\n')
  // Trim each line
  formatted = formatted
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
  return formatted
}

export const addSmartEmojis = (text: string): string => {
  const emojiMap: Record<string, string> = {
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
    'خصم': '🏷️',
    'تخفيف': '🔖',
    'موثوق': '☑️',
    'مجاني': '🆓',
  }

  let result = text
  Object.entries(emojiMap).forEach(([word, emoji]) => {
    const regex = new RegExp(`(^|\\s)${word}(\\s|$)`, 'gi')
    result = result.replace(regex, `$1${emoji} ${word}$2`)
  })
  return result
}

export const generateMarketingCopy = (productType: string): string[] => {
  const copies: Record<string, string[]> = {
    electronics: [
      '✨ منتج إلكتروني عالي الجودة والأداء',
      '⚡ تكنولوجيا حديثة وموثوقة',
      '🎯 أفضل سعر في السوق',
      '🔧 ضمان كامل وخدمة ما بعد البيع',
    ],
    clothing: [
      '👗 موضة عصرية وراقية',
      '🌟 خامة فاخرة وفريدة',
      '💎 تصميم حصري وأنيق',
      '🛍️ عروض خاصة ومميزة',
    ],
    general: [
      '✅ منتج أصلي وموثوق',
      '💯 جودة مضمونة 100%',
      '🎁 توصيل سريع ومجاني',
      '💰 سعر تنافسي جداً',
    ],
  }

  return copies[productType] || copies.general
}

export const colorizeText = (text: string): string[] => {
  const lines = text.split('\n')
  const colors = [
    'text-blue-600',
    'text-purple-600',
    'text-green-600',
    'text-red-600',
    'text-pink-600',
    'text-indigo-600',
    'text-cyan-600',
  ]
  
  return lines.map((line, idx) => {
    const color = colors[idx % colors.length]
    return `<p class="${color}">${line}</p>`
  })
}
