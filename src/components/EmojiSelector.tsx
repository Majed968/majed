import React, { useState } from 'react'
import { Smile, Search } from 'lucide-react'

interface EmojiPackage {
  id: string
  name: string
  emojis: string[]
  category: string
}

const EMOJI_CATEGORIES = [
  {
    id: 'popular',
    name: '⭐ الشهيرة',
    emojis: ['😊', '❤️', '👍', '🔥', '✨', '🎉', '💯', '⚡'],
  },
  {
    id: 'products',
    name: '🛍️ المنتجات',
    emojis: ['📱', '💻', '⌚', '👕', '👟', '💄', '👜', '🎧'],
  },
  {
    id: 'shopping',
    name: '🛒 التسوق',
    emojis: ['💰', '💵', '💳', '🛒', '🎁', '🏷️', '📦', '🚚'],
  },
  {
    id: 'communication',
    name: '📞 التواصل',
    emojis: ['📱', '☎️', '📞', '💬', '📧', '📨', '💌', '📮'],
  },
  {
    id: 'quality',
    name: '✅ الجودة',
    emojis: ['✅', '✔️', '☑️', '👌', '👏', '🏆', '⭐', '🌟'],
  },
  {
    id: 'delivery',
    name: '🚚 التوصيل',
    emojis: ['🚚', '🚛', '✈️', '🌍', '🗺️', '📍', '⏰', '⏱️'],
  },
  {
    id: 'warranty',
    name: '🔒 الضمان',
    emojis: ['🔒', '🔐', '🛡️', '✅', '💯', '🤝', '📋', '📄'],
  },
  {
    id: 'emotions',
    name: '😍 المشاعر',
    emojis: ['😍', '🥰', '😘', '😊', '🤩', '😎', '🤗', '���'],
  },
  {
    id: 'deals',
    name: '🔥 العروض',
    emojis: ['🔥', '⚡', '💥', '🎊', '🎈', '🎀', '🌟', '✨'],
  },
  {
    id: 'custom',
    name: '⭐ مخصص',
    emojis: [],
  },
]

interface EmojiSelectorProps {
  onEmojiSelect: (emoji: string) => void
}

export default function EmojiSelector({ onEmojiSelect }: EmojiSelectorProps) {
  const [activeCategory, setActiveCategory] = useState('popular')
  const [searchTerm, setSearchTerm] = useState('')
  const [customEmojis, setCustomEmojis] = useState<string[]>([])
  const [newEmoji, setNewEmoji] = useState('')

  const currentCategory = EMOJI_CATEGORIES.find((c) => c.id === activeCategory)
  const displayEmojis = currentCategory?.id === 'custom' ? customEmojis : currentCategory?.emojis || []

  const filteredEmojis = displayEmojis.filter((emoji) => {
    if (activeCategory === 'custom') return true
    return emoji.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const addCustomEmoji = () => {
    if (newEmoji.trim()) {
      setCustomEmojis([...customEmojis, newEmoji.trim()])
      setNewEmoji('')
    }
  }

  const removeCustomEmoji = (index: number) => {
    setCustomEmojis(customEmojis.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Smile className="text-yellow-500" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">😊 مكتبة الرموز والإيموجي</h3>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث عن رموز..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Categories */}
      <div className="mb-4 flex flex-wrap gap-2">
        {EMOJI_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id)
              setSearchTerm('')
            }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={cat.name}
          >
            {cat.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Emojis Grid */}
      {activeCategory !== 'custom' ? (
        <div className="grid grid-cols-6 md:grid-cols-8 gap-2 mb-4">
          {filteredEmojis.map((emoji, idx) => (
            <button
              key={idx}
              onClick={() => onEmojiSelect(emoji)}
              className="p-3 bg-gray-50 hover:bg-blue-100 rounded-lg text-2xl transition cursor-pointer hover:scale-110"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Add Custom Emoji */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newEmoji}
              onChange={(e) => setNewEmoji(e.target.value)}
              placeholder="أضف رمز مخصص"
              maxLength="2"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xl text-center"
            />
            <button
              onClick={addCustomEmoji}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              إضافة
            </button>
          </div>

          {/* Custom Emojis Grid */}
          {customEmojis.length > 0 && (
            <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
              {customEmojis.map((emoji, idx) => (
                <div key={idx} className="relative">
                  <button
                    onClick={() => onEmojiSelect(emoji)}
                    className="w-full p-3 bg-gray-50 hover:bg-blue-100 rounded-lg text-2xl transition cursor-pointer hover:scale-110"
                  >
                    {emoji}
                  </button>
                  <button
                    onClick={() => removeCustomEmoji(idx)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700 border border-blue-200">
        💡 اضغط على أي رمز لإضافته. يمكنك إنشاء رموز مخصصة في التبويب "⭐ مخصص"
      </div>
    </div>
  )
}
