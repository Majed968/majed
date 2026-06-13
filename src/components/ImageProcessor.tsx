import React, { useState, useEffect } from 'react'
import { FileUp, Trash2, Plus, Download, Share2, Eye, EyeOff } from 'lucide-react'
import FloatingToolbar from './FloatingToolbar'
import AdvancedImageEditor from './AdvancedImageEditor'

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

interface ImageProcessorProps {
  images: File[]
  processedText: string
  additionalTexts: string[]
  imageTexts: string[]
}

export default function ImageProcessor({
  images,
  processedText,
  additionalTexts,
  imageTexts,
}: ImageProcessorProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [overlays, setOverlays] = useState<TextOverlay[]>([])
  const [selectedOverlay, setSelectedOverlay] = useState<TextOverlay | null>(null)
  const [imageWidth, setImageWidth] = useState(0)
  const [imageHeight, setImageHeight] = useState(0)

  const currentImage = images[currentImageIndex]

  // Get image dimensions
  useEffect(() => {
    if (!currentImage) return
    const img = new Image()
    img.onload = () => {
      setImageWidth(img.width)
      setImageHeight(img.height)
    }
    img.src = URL.createObjectURL(currentImage)
  }, [currentImage])

  const addTextOverlay = (text: string) => {
    const newOverlay: TextOverlay = {
      id: Date.now().toString(),
      text,
      x: 50,
      y: 50,
      fontSize: 24,
      fontColor: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.7)',
      opacity: 1,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'center',
      rotation: 0,
      shadow: true,
      shadowColor: 'rgba(0,0,0,0.5)',
      shadowBlur: 4,
      borderWidth: 0,
      borderColor: '#000000',
      borderRadius: 8,
      padding: 8,
      backgroundShape: 'rounded',
      visible: true,
      locked: false,
      zIndex: overlays.length,
    }
    setOverlays([...overlays, newOverlay])
    setSelectedOverlay(newOverlay)
  }

  const updateOverlay = (id: string, updates: Partial<TextOverlay>) => {
    setOverlays((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o))
    )
    if (selectedOverlay?.id === id) {
      setSelectedOverlay({ ...selectedOverlay, ...updates })
    }
  }

  const deleteOverlay = (id: string) => {
    setOverlays((prev) => prev.filter((o) => o.id !== id))
    if (selectedOverlay?.id === id) {
      setSelectedOverlay(null)
    }
  }

  const duplicateOverlay = (overlay: TextOverlay) => {
    const newOverlay = {
      ...overlay,
      id: Date.now().toString(),
      x: overlay.x + 20,
      y: overlay.y + 20,
      zIndex: overlay.zIndex + 1,
    }
    setOverlays([...overlays, newOverlay])
    setSelectedOverlay(newOverlay)
  }

  if (images.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">📸</div>
        <p className="text-gray-600 text-lg">لم يتم تحميل أي صور</p>
        <p className="text-gray-500 text-sm mt-2">قم بتحميل صور من القسم الأيسر</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Image Navigation */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
            disabled={currentImageIndex === 0}
            className="px-4 py-2 bg-gray-300 disabled:opacity-50 hover:bg-gray-400 rounded transition"
          >
            ← السابقة
          </button>
          <span className="text-sm font-medium text-gray-700">
            الصورة {currentImageIndex + 1} من {images.length}
          </span>
          <button
            onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))}
            disabled={currentImageIndex === images.length - 1}
            className="px-4 py-2 bg-gray-300 disabled:opacity-50 hover:bg-gray-400 rounded transition"
          >
            التالية →
          </button>
        </div>
      </div>

      {/* Advanced Image Editor */}
      {currentImage && (
        <AdvancedImageEditor
          imageFile={currentImage}
          overlays={overlays}
          onOverlaySelect={setSelectedOverlay}
          onOverlayMove={(id, x, y) => updateOverlay(id, { x, y })}
          onAddOverlay={() => addTextOverlay('نص جديد')}
        />
      )}

      {/* Floating Toolbar */}
      {selectedOverlay && (
        <FloatingToolbar
          overlay={selectedOverlay}
          onUpdate={updateOverlay}
          onDelete={deleteOverlay}
          onDuplicate={duplicateOverlay}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
        />
      )}

      {/* Quick Add Text */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="text-sm font-semibold mb-3">⚡ إضافة سريعة</h4>
        <div className="space-y-2">
          {processedText && (
            <button
              onClick={() => addTextOverlay(processedText.substring(0, 50))}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
            >
              + إضافة السعر
            </button>
          )}
          {additionalTexts.map((text, idx) => (
            <button
              key={idx}
              onClick={() => addTextOverlay(text)}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition text-sm truncate"
              title={text}
            >
              + {text}
            </button>
          ))}
        </div>
      </div>

      {/* Overlays List */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="text-sm font-semibold mb-3">📝 النصوص المضافة ({overlays.length})</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {overlays.length === 0 ? (
            <p className="text-xs text-gray-500">لا توجد نصوص مضافة</p>
          ) : (
            overlays.map((overlay) => (
              <div
                key={overlay.id}
                onClick={() => setSelectedOverlay(overlay)}
                className={`p-3 rounded cursor-pointer transition ${
                  selectedOverlay?.id === overlay.id
                    ? 'bg-blue-100 border-l-4 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{overlay.text}</p>
                    <p className="text-xs text-gray-500">X: {overlay.x}, Y: {overlay.y}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateOverlay(overlay.id, { visible: !overlay.visible })
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      {overlay.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        duplicateOverlay(overlay)
                      }}
                      className="p-1 hover:bg-gray-200 rounded text-green-600"
                    >
                      +
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteOverlay(overlay.id)
                      }}
                      className="p-1 hover:bg-gray-200 rounded text-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
