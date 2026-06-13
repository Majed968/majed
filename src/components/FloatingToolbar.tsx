import React, { useState, useRef, useEffect } from 'react'
import {
  Move,
  Plus,
  Minus,
  Palette,
  Type,
  Trash2,
  Copy,
  RotateCcw,
  Settings,
  Eye,
  EyeOff,
  Download,
  Share2,
  Lock,
  Unlock,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'

interface TextOverlay {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontColor: string
  backgroundColor: string
  opacity: number
  fontFamily: string
  fontWeight: 'normal' | 'bold' | '900'
  fontStyle: 'normal' | 'italic'
  textAlign: 'left' | 'center' | 'right'
  rotation: number
  shadow: boolean
  shadowColor: string
  shadowBlur: number
  borderWidth: number
  borderColor: string
  borderRadius: number
  padding: number
  backgroundShape: 'rectangle' | 'rounded' | 'circle'
  visible: boolean
  locked: boolean
  zIndex: number
}

interface FloatingToolbarProps {
  overlay: TextOverlay | null
  onUpdate: (id: string, updates: Partial<TextOverlay>) => void
  onDelete: (id: string) => void
  onDuplicate: (overlay: TextOverlay) => void
  imageWidth: number
  imageHeight: number
}

export default function FloatingToolbar({
  overlay,
  onUpdate,
  onDelete,
  onDuplicate,
  imageWidth,
  imageHeight,
}: FloatingToolbarProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState<'position' | 'text' | 'style' | 'effects'>('text')
  const toolbarRef = useRef<HTMLDivElement>(null)

  if (!overlay) return null

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-no-drag]')) return
    setIsDragging(true)
    const rect = toolbarRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (toolbarRef.current) {
        toolbarRef.current.style.left = `${e.clientX - dragOffset.x}px`
        toolbarRef.current.style.top = `${e.clientY - dragOffset.y}px`
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const handleUpdate = (updates: Partial<TextOverlay>) => {
    onUpdate(overlay.id, updates)
  }

  const tabs = [
    { id: 'text', label: '📝', title: 'النص' },
    { id: 'style', label: '🎨', title: 'الألوان والتنسيق' },
    { id: 'effects', label: '✨', title: 'المؤثرات' },
    { id: 'position', label: '📍', title: 'الموضع' },
  ]

  return (
    <div
      ref={toolbarRef}
      onMouseDown={handleMouseDown}
      className="fixed bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg shadow-2xl border border-slate-700 p-4 w-96 z-50 cursor-move text-white"
      style={{
        top: '50px',
        right: '20px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
        <div>
          <h3 className="font-bold text-sm">🎯 محرر النص</h3>
          <p className="text-xs text-slate-400 mt-1 truncate">{overlay.text}</p>
        </div>
        <div className="flex gap-1" data-no-drag>
          <button
            onClick={() => handleUpdate({ visible: !overlay.visible })}
            className="p-2 hover:bg-slate-700 rounded transition"
            title={overlay.visible ? 'إخفاء' : 'إظهار'}
          >
            {overlay.visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={() => handleUpdate({ locked: !overlay.locked })}
            className="p-2 hover:bg-slate-700 rounded transition"
            title={overlay.locked ? 'فتح' : 'قفل'}
          >
            {overlay.locked ? <Lock size={16} /> : <Unlock size={16} />}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4" data-no-drag>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded text-xs font-medium transition ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600'
            }`}
            title={tab.title}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-3 max-h-96 overflow-y-auto" data-no-drag>
        {/* Text Tab */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            {/* Font Size */}
            <div>
              <label className="text-xs font-semibold block mb-2">🔤 حجم الخط</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdate({ fontSize: Math.max(8, overlay.fontSize - 2) })}
                  className="p-1 bg-slate-700 hover:bg-slate-600 rounded"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="range"
                  min="8"
                  max="120"
                  value={overlay.fontSize}
                  onChange={(e) => handleUpdate({ fontSize: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <button
                  onClick={() => handleUpdate({ fontSize: Math.min(120, overlay.fontSize + 2) })}
                  className="p-1 bg-slate-700 hover:bg-slate-600 rounded"
                >
                  <Plus size={14} />
                </button>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded min-w-10 text-center">
                  {overlay.fontSize}
                </span>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="text-xs font-semibold block mb-2">🔤 نوع الخط</label>
              <select
                value={overlay.fontFamily}
                onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
                className="w-full bg-slate-700 text-white text-xs rounded px-2 py-1 border border-slate-600"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Impact">Impact</option>
                <option value="Trebuchet MS">Trebuchet MS</option>
                <option value="Tahoma">Tahoma</option>
              </select>
            </div>

            {/* Font Weight */}
            <div>
              <label className="text-xs font-semibold block mb-2">⚖️ سمك الخط</label>
              <div className="flex gap-2">
                {['normal', 'bold', '900'].map((weight) => (
                  <button
                    key={weight}
                    onClick={() => handleUpdate({ fontWeight: weight as any })}
                    className={`flex-1 py-1 rounded text-xs font-medium transition ${
                      overlay.fontWeight === weight ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {weight === 'normal' ? 'عادي' : weight === 'bold' ? 'غامق' : 'جداً غامق'}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Style */}
            <div>
              <label className="text-xs font-semibold block mb-2">📖 نمط الخط</label>
              <div className="flex gap-2">
                {['normal', 'italic'].map((style) => (
                  <button
                    key={style}
                    onClick={() => handleUpdate({ fontStyle: style as any })}
                    className={`flex-1 py-1 rounded text-xs font-medium transition ${
                      overlay.fontStyle === style ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    style={{ fontStyle: style as any }}
                  >
                    {style === 'normal' ? 'عادي' : 'مائل'}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Align */}
            <div>
              <label className="text-xs font-semibold block mb-2">↔️ محاذاة الن��</label>
              <div className="flex gap-1">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => handleUpdate({ textAlign: align as any })}
                    className={`flex-1 py-1 rounded text-xs transition ${
                      overlay.textAlign === align ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {align === 'left' ? '←' : align === 'center' ? '↔' : '→'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Style Tab */}
        {activeTab === 'style' && (
          <div className="space-y-3">
            {/* Font Color */}
            <div>
              <label className="text-xs font-semibold block mb-2">🎨 لون الخط</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={overlay.fontColor}
                  onChange={(e) => handleUpdate({ fontColor: e.target.value })}
                  className="w-12 h-8 rounded cursor-pointer border border-slate-600"
                />
                <input
                  type="text"
                  value={overlay.fontColor}
                  onChange={(e) => handleUpdate({ fontColor: e.target.value })}
                  className="flex-1 bg-slate-700 text-white text-xs rounded px-2 py-1 border border-slate-600"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="text-xs font-semibold block mb-2">🖼️ لون الخلفية</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={overlay.backgroundColor}
                  onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
                  className="w-12 h-8 rounded cursor-pointer border border-slate-600"
                />
                <input
                  type="text"
                  value={overlay.backgroundColor}
                  onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
                  className="flex-1 bg-slate-700 text-white text-xs rounded px-2 py-1 border border-slate-600"
                  placeholder="rgba(0,0,0,0.7)"
                />
              </div>
            </div>

            {/* Background Shape */}
            <div>
              <label className="text-xs font-semibold block mb-2">📦 شكل الخلفية</label>
              <div className="flex gap-1">
                {['rectangle', 'rounded', 'circle'].map((shape) => (
                  <button
                    key={shape}
                    onClick={() => handleUpdate({ backgroundShape: shape as any })}
                    className={`flex-1 py-1 rounded text-xs transition ${
                      overlay.backgroundShape === shape ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {shape === 'rectangle' ? '▭' : shape === 'rounded' ? '▯' : '●'}
                  </button>
                ))}
              </div>
            </div>

            {/* Border */}
            <div>
              <label className="text-xs font-semibold block mb-2">🔲 سمك الحد</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={overlay.borderWidth}
                  onChange={(e) => handleUpdate({ borderWidth: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-xs bg-slate-700 px-2 py-1 rounded min-w-10 text-center">
                  {overlay.borderWidth}px
                </span>
              </div>
            </div>

            {/* Border Color */}
            {overlay.borderWidth > 0 && (
              <div>
                <label className="text-xs font-semibold block mb-2">🎨 لون الحد</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={overlay.borderColor}
                    onChange={(e) => handleUpdate({ borderColor: e.target.value })}
                    className="w-12 h-8 rounded cursor-pointer border border-slate-600"
                  />
                  <input
                    type="text"
                    value={overlay.borderColor}
                    onChange={(e) => handleUpdate({ borderColor: e.target.value })}
                    className="flex-1 bg-slate-700 text-white text-xs rounded px-2 py-1 border border-slate-600"
                  />
                </div>
              </div>
            )}

            {/* Padding */}
            <div>
              <label className="text-xs font-semibold block mb-2">📏 المسافة الداخلية</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={overlay.padding}
                  onChange={(e) => handleUpdate({ padding: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-xs bg-slate-700 px-2 py-1 rounded min-w-10 text-center">
                  {overlay.padding}px
                </span>
              </div>
            </div>

            {/* Opacity */}
            <div>
              <label className="text-xs font-semibold block mb-2">👁️ الشفافية</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={overlay.opacity}
                  onChange={(e) => handleUpdate({ opacity: parseFloat(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-xs bg-slate-700 px-2 py-1 rounded min-w-10 text-center">
                  {Math.round(overlay.opacity * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Effects Tab */}
        {activeTab === 'effects' && (
          <div className="space-y-3">
            {/* Shadow */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold">🌑 ظل النص</label>
              <input
                type="checkbox"
                checked={overlay.shadow}
                onChange={(e) => handleUpdate({ shadow: e.target.checked })}
                className="cursor-pointer"
              />
            </div>

            {overlay.shadow && (
              <>
                {/* Shadow Color */}
                <div>
                  <label className="text-xs font-semibold block mb-2">🎨 لون الظل</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={overlay.shadowColor}
                      onChange={(e) => handleUpdate({ shadowColor: e.target.value })}
                      className="w-12 h-8 rounded cursor-pointer border border-slate-600"
                    />
                    <input
                      type="text"
                      value={overlay.shadowColor}
                      onChange={(e) => handleUpdate({ shadowColor: e.target.value })}
                      className="flex-1 bg-slate-700 text-white text-xs rounded px-2 py-1 border border-slate-600"
                    />
                  </div>
                </div>

                {/* Shadow Blur */}
                <div>
                  <label className="text-xs font-semibold block mb-2">💨 تمويه الظل</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={overlay.shadowBlur}
                      onChange={(e) => handleUpdate({ shadowBlur: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-xs bg-slate-700 px-2 py-1 rounded min-w-10 text-center">
                      {overlay.shadowBlur}px
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Rotation */}
            <div>
              <label className="text-xs font-semibold block mb-2">🔄 الدوران</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={overlay.rotation}
                  onChange={(e) => handleUpdate({ rotation: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <button
                  onClick={() => handleUpdate({ rotation: 0 })}
                  className="p-1 bg-slate-700 hover:bg-slate-600 rounded"
                  title="إعادة تعيين"
                >
                  <RotateCcw size={14} />
                </button>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded min-w-12 text-center">
                  {overlay.rotation}°
                </span>
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="text-xs font-semibold block mb-2">🔘 تقريب الزوايا</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={overlay.borderRadius}
                  onChange={(e) => handleUpdate({ borderRadius: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <span className="text-xs bg-slate-700 px-2 py-1 rounded min-w-10 text-center">
                  {overlay.borderRadius}px
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Position Tab */}
        {activeTab === 'position' && (
          <div className="space-y-3">
            {/* X Position */}
            <div>
              <label className="text-xs font-semibold block mb-2">📍 الموضع X</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max={imageWidth}
                  value={overlay.x}
                  onChange={(e) => handleUpdate({ x: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={overlay.x}
                  onChange={(e) => handleUpdate({ x: parseInt(e.target.value) })}
                  className="w-16 bg-slate-700 text-white text-xs rounded px-2 py-1 border border-slate-600"
                />
              </div>
            </div>

            {/* Y Position */}
            <div>
              <label className="text-xs font-semibold block mb-2">📍 الموضع Y</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max={imageHeight}
                  value={overlay.y}
                  onChange={(e) => handleUpdate({ y: parseInt(e.target.value) })}
                  className="flex-1"
                />
                <input
                  type="number"
                  value={overlay.y}
                  onChange={(e) => handleUpdate({ y: parseInt(e.target.value) })}
                  className="w-16 bg-slate-700 text-white text-xs rounded px-2 py-1 border border-slate-600"
                />
              </div>
            </div>

            {/* Z-Index */}
            <div>
              <label className="text-xs font-semibold block mb-2">📚 ترتيب الطبقات</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate({ zIndex: overlay.zIndex - 1 })}
                  className="flex-1 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs"
                >
                  ↓ للخلف
                </button>
                <button
                  onClick={() => handleUpdate({ zIndex: overlay.zIndex + 1 })}
                  className="flex-1 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs"
                >
                  ↑ للأمام
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">Z-Index: {overlay.zIndex}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-slate-700 flex gap-2" data-no-drag>
        <button
          onClick={() => onDuplicate(overlay)}
          className="flex-1 flex items-center justify-center gap-2 px-2 py-2 bg-green-600 hover:bg-green-700 rounded text-xs font-medium transition"
          title="تكرار"
        >
          <Copy size={14} /> تكرار
        </button>
        <button
          onClick={() => onDelete(overlay.id)}
          className="flex-1 flex items-center justify-center gap-2 px-2 py-2 bg-red-600 hover:bg-red-700 rounded text-xs font-medium transition"
          title="حذف"
        >
          <Trash2 size={14} /> حذف
        </button>
      </div>
    </div>
  )
}
