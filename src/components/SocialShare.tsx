import React, { useState } from 'react'
import { Share2, Facebook, MessageCircle, Twitter, Send } from 'lucide-react'

interface ShareOptions {
  platform: 'facebook' | 'whatsapp' | 'twitter' | 'telegram' | 'instagram'
  text: string
  hashtags: string[]
  includeLink: boolean
}

interface SocialShareProps {
  text: string
  images: File[]
  onShare: (platform: string) => void
}

const PLATFORMS = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600',
    url: 'https://facebook.com',
    description: 'شارك مع 3 مليارات مستخدم',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    color: 'bg-green-500',
    url: 'https://wa.me',
    description: 'شارك مع جهات الاتصال الخاصة بك',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-blue-400',
    url: 'https://twitter.com',
    description: 'انشر التغريدات والمنشورات',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: Send,
    color: 'bg-sky-400',
    url: 'https://t.me',
    description: 'شارك في المجموعات والقنوات',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: () => <span className="text-xl">📷</span>,
    color: 'bg-pink-600',
    url: 'https://instagram.com',
    description: 'شارك الصور والفيديوهات',
  },
]

const DEFAULT_HASHTAGS = [
  '#تسويق',
  '#منتجات',
  '#عرض_خاص',
  '#جودة',
  '#أصلي',
  '#توصيل',
  '#ضمان',
  '#اشترِ_الآن',
]

export default function SocialShare({ text, images, onShare }: SocialShareProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [customHashtags, setCustomHashtags] = useState<string[]>([])
  const [newHashtag, setNewHashtag] = useState('')
  const [scheduleTime, setScheduleTime] = useState<string>('')
  const [showPreview, setShowPreview] = useState(false)

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId]
    )
  }

  const addHashtag = () => {
    if (newHashtag.trim() && !customHashtags.includes(newHashtag.trim())) {
      setCustomHashtags([...customHashtags, newHashtag.trim()])
      setNewHashtag('')
    }
  }

  const removeHashtag = (tag: string) => {
    setCustomHashtags(customHashtags.filter((t) => t !== tag))
  }

  const shareText = text + '\n\n' + customHashtags.join(' ')

  const handleShare = (platformId: string) => {
    const encodedText = encodeURIComponent(shareText)
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      telegram: `https://t.me/share/url?url=${window.location.href}&text=${encodedText}`,
      instagram: `https://www.instagram.com/`,
    }

    if (platformId === 'instagram') {
      alert('📱 Instagram: يرجى فتح التطبيق وشارك الصورة يدويًا')
    } else {
      window.open(urls[platformId], '_blank', 'width=600,height=400')
    }
    onShare(platformId)
  }

  return (
    <div className="space-y-6">
      {/* Platforms Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="text-purple-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">📱 مشاركة على وسائل التواصل</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`p-4 rounded-lg transition ${
                selectedPlatforms.includes(platform.id)
                  ? `${platform.color} text-white shadow-lg`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-2xl mb-2">📱</div>
              <p className="text-xs font-semibold">{platform.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Hashtags Manager */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">#️⃣ إدارة الوسوم</h4>

        {/* Suggested Hashtags */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">💡 الوسوم المقترحة:</p>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_HASHTAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  if (!customHashtags.includes(tag)) {
                    setCustomHashtags([...customHashtags, tag])
                  }
                }}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  customHashtags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Hashtags */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">➕ وسم مخصص</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newHashtag}
              onChange={(e) => setNewHashtag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
              placeholder="أدخل وسماً مخصصاً"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={addHashtag}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
            >
              إضافة
            </button>
          </div>
        </div>

        {/* Custom Hashtags List */}
        {customHashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {customHashtags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                <span>{tag}</span>
                <button
                  onClick={() => removeHashtag(tag)}
                  className="hover:text-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 mb-3"
        >
          {showPreview ? '🔽 إخفاء المعاينة' : '👁️ عرض المعاينة'}
        </button>

        {showPreview && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{shareText}</p>
          </div>
        )}
      </div>

      {/* Share Buttons */}
      {selectedPlatforms.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-6 border border-purple-200">
          <p className="text-sm text-gray-700 mb-4">🎯 اختر المنصات لمشاركة المنشور:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PLATFORMS.filter((p) => selectedPlatforms.includes(p.id)).map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleShare(platform.id)}
                className={`flex items-center justify-center gap-2 px-4 py-3 ${platform.color} text-white rounded-lg hover:opacity-90 transition font-medium`}
              >
                <platform.icon size={20} />
                شارك على {platform.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
