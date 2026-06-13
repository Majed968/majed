import React, { useState, useEffect } from 'react'
import { Sparkles, ThumbsUp, ThumbsDown, Copy, Zap } from 'lucide-react'

interface Suggestion {
  id: string
  type: 'marketing' | 'formatting' | 'emoji' | 'enhancement'
  text: string
  reason: string
  applied: boolean
}

interface SmartSuggestionsProps {
  productText: string
  additionalTexts: string[]
  onApplySuggestion: (suggestion: Suggestion) => void
  onRejectSuggestion: (id: string) => void
}

const MARKETING_PHRASES = [
  '🌟 منتج ممتاز وراقي بأفضل جودة',
  '⭐ جودة عالية جداً وسعر منافس',
  '💎 تصميم فاخر وأداء عالي',
  '🔥 عرض حصري ومحدود',
  '✅ منتج أصلي وموثوق بنسبة 100%',
  '🚚 توصيل سريع ومجاني',
  '💰 أفضل سعر في السوق',
  '🎁 ضمان كامل للمنتج',
  '📦 تغليف فاخر وآمن',
  '☎️ خدمة عملاء متميزة 24/7',
  '🌍 شحن دولي متاح',
  '💳 دفع آمن وموثوق',
]

const FORMATTING_RULES = [
  { pattern: /[a-zA-Z0-9]{50,}/, suggestion: 'أضف فواصل لتحسين القراءة', type: 'formatting' },
  { pattern: /[^.!?]\n[^\n]/, suggestion: 'استخدم علامات ترقيم مناسبة', type: 'formatting' },
]

const EMOJI_SUGGESTIONS: Record<string, string> = {
  'سعر': '💰',
  'هاتف': '📱',
  'واتس': '💬',
  'توصيل': '🚚',
  'ضمان': '✅',
  'جودة': '⭐',
  'عرض': '🎁',
  'خصم': '🔖',
  'جديد': '🆕',
  'محدود': '⏰',
}

export default function SmartSuggestions({
  productText,
  additionalTexts,
  onApplySuggestion,
  onRejectSuggestion,
}: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    generateSuggestions()
  }, [productText, additionalTexts])

  const generateSuggestions = () => {
    const newSuggestions: Suggestion[] = []

    // Marketing suggestions
    if (productText.length > 0) {
      const randomPhrases = MARKETING_PHRASES.sort(() => Math.random() - 0.5).slice(0, 2)
      randomPhrases.forEach((phrase) => {
        newSuggestions.push({
          id: `marketing_${Date.now()}_${Math.random()}`,
          type: 'marketing',
          text: phrase,
          reason: 'جملة تسويقية جذابة تزيد من المبيعات',
          applied: false,
        })
      })
    }

    // Emoji suggestions
    Object.entries(EMOJI_SUGGESTIONS).forEach(([keyword, emoji]) => {
      if (productText.toLowerCase().includes(keyword)) {
        newSuggestions.push({
          id: `emoji_${keyword}`,
          type: 'emoji',
          text: `أضف ${emoji} عند ذكر "${keyword}"`,
          reason: 'استخدام الرموز يجعل المنشور أكثر جاذبية',
          applied: false,
        })
      }
    })

    // Enhancement suggestions
    if (!productText.includes('📞') && !productText.includes('واتس') && additionalTexts.length > 0) {
      newSuggestions.push({
        id: `enhancement_contact`,
        type: 'enhancement',
        text: 'أضف رقم واتساب بارز في بداية المنشور',
        reason: 'يزيد من الاستجابة والمبيعات',
        applied: false,
      })
    }

    if (productText.length < 100) {
      newSuggestions.push({
        id: `enhancement_length`,
        type: 'enhancement',
        text: 'الوصف قصير نسبياً - أضف المزيد من التفاصيل',
        reason: 'الأوصاف الطويلة تجذب عملاء أكثر',
        applied: false,
      })
    }

    setSuggestions(newSuggestions)
  }

  const handleApply = (suggestion: Suggestion) => {
    onApplySuggestion(suggestion)
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === suggestion.id ? { ...s, applied: true } : s
      )
    )
  }

  const handleReject = (id: string) => {
    onRejectSuggestion(id)
    setSuggestions((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-yellow-500" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">✨ اقتراحات ذكية</h3>
        <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          {suggestions.length} اقتراح
        </span>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>💡 لا توجد اقتراحات حالياً</p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`border rounded-lg p-4 transition ${
                suggestion.applied
                  ? 'bg-green-50 border-green-300'
                  : 'bg-blue-50 border-blue-300 hover:border-blue-500'
              }`}
            >
              <div
                className="cursor-pointer"
                onClick={() =>
                  setExpandedId(expandedId === suggestion.id ? null : suggestion.id)
                }
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-1">
                    {suggestion.type === 'marketing' && '🎯'}
                    {suggestion.type === 'emoji' && '😊'}
                    {suggestion.type === 'enhancement' && '⚡'}
                    {suggestion.type === 'formatting' && '📝'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{suggestion.text}</p>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.reason}</p>
                  </div>
                  <div className="flex gap-2">
                    {!suggestion.applied && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApply(suggestion)
                          }}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                          title="تطبيق"
                        >
                          <ThumbsUp size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReject(suggestion.id)
                          }}
                          className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                          title="تجاهل"
                        >
                          <ThumbsDown size={16} />
                        </button>
                      </>
                    )}
                    {suggestion.applied && (
                      <span className="px-3 py-2 bg-green-600 text-white text-xs rounded-lg font-medium">
                        ✅ تم التطبيق
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
