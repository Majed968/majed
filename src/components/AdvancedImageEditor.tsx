import React, { useRef, useEffect, useState } from 'react'
import { Plus, Trash2, Download, Share2 } from 'lucide-react'

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

interface AdvancedImageEditorProps {
  imageFile: File
  overlays: TextOverlay[]
  onOverlaySelect: (overlay: TextOverlay) => void
  onOverlayMove: (id: string, x: number, y: number) => void
  onAddOverlay: () => void
}

export default function AdvancedImageEditor({
  imageFile,
  overlays,
  onOverlaySelect,
  onOverlayMove,
  onAddOverlay,
}: AdvancedImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [draggedOverlay, setDraggedOverlay] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)

  // Load image
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string)
      }
      reader.readAsDataURL(imageFile)
    }
  }, [imageFile])

  // Draw on canvas
  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      // Sort overlays by z-index
      const sortedOverlays = [...overlays].sort((a, b) => a.zIndex - b.zIndex)

      sortedOverlays.forEach((overlay) => {
        if (!overlay.visible) return

        ctx.save()
        ctx.globalAlpha = overlay.opacity
        ctx.translate(overlay.x, overlay.y)
        ctx.rotate((overlay.rotation * Math.PI) / 180)
        ctx.translate(-overlay.x, -overlay.y)

        // Draw background
        const metrics = ctx.measureText(overlay.text)
        const width = metrics.width + overlay.padding * 2
        const height = overlay.fontSize + overlay.padding * 2

        // Draw background shape
        ctx.fillStyle = overlay.backgroundColor
        if (overlay.backgroundShape === 'circle') {
          ctx.beginPath()
          ctx.arc(
            overlay.x + width / 2,
            overlay.y + height / 2,
            Math.max(width, height) / 2,
            0,
            Math.PI * 2
          )
          ctx.fill()
        } else if (overlay.backgroundShape === 'rounded') {
          const x = overlay.x - overlay.padding
          const y = overlay.y - overlay.padding - overlay.fontSize
          ctx.beginPath()
          ctx.moveTo(x + overlay.borderRadius, y)
          ctx.lineTo(x + width - overlay.borderRadius, y)
          ctx.quadraticCurveTo(x + width, y, x + width, y + overlay.borderRadius)
          ctx.lineTo(x + width, y + height - overlay.borderRadius)
          ctx.quadraticCurveTo(x + width, y + height, x + width - overlay.borderRadius, y + height)
          ctx.lineTo(x + overlay.borderRadius, y + height)
          ctx.quadraticCurveTo(x, y + height, x, y + height - overlay.borderRadius)
          ctx.lineTo(x, y + overlay.borderRadius)
          ctx.quadraticCurveTo(x, y, x + overlay.borderRadius, y)
          ctx.closePath()
          ctx.fill()
        } else {
          ctx.fillRect(
            overlay.x - overlay.padding,
            overlay.y - overlay.padding - overlay.fontSize,
            width,
            height
          )
        }

        // Draw border
        if (overlay.borderWidth > 0) {
          ctx.strokeStyle = overlay.borderColor
          ctx.lineWidth = overlay.borderWidth
          ctx.strokeRect(
            overlay.x - overlay.padding,
            overlay.y - overlay.padding - overlay.fontSize,
            width,
            height
          )
        }

        // Draw shadow
        if (overlay.shadow) {
          ctx.shadowColor = overlay.shadowColor
          ctx.shadowBlur = overlay.shadowBlur
          ctx.shadowOffsetX = 2
          ctx.shadowOffsetY = 2
        }

        // Draw text
        ctx.fillStyle = overlay.fontColor
        ctx.font = `${overlay.fontStyle === 'italic' ? 'italic' : ''} ${overlay.fontWeight} ${overlay.fontSize}px ${overlay.fontFamily}`
        ctx.textAlign = overlay.textAlign as any
        ctx.textBaseline = 'bottom'
        ctx.fillText(overlay.text, overlay.x, overlay.y)

        ctx.restore()
      })
    }
    img.src = imageUrl
  }, [imageUrl, overlays])

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    // Find clicked overlay (from top to bottom)
    const sortedOverlays = [...overlays].sort((a, b) => b.zIndex - a.zIndex)
    for (const overlay of sortedOverlays) {
      const metrics = canvasRef.current?.getContext('2d')?.measureText(overlay.text)
      if (!metrics) continue

      const width = metrics.width + overlay.padding * 2
      const height = overlay.fontSize + overlay.padding * 2

      if (
        x >= overlay.x - overlay.padding &&
        x <= overlay.x - overlay.padding + width &&
        y >= overlay.y - overlay.padding - overlay.fontSize &&
        y <= overlay.y - overlay.padding - overlay.fontSize + height
      ) {
        if (!overlay.locked) {
          setDraggedOverlay(overlay.id)
          setDragOffset({ x: x - overlay.x, y: y - overlay.y })
          onOverlaySelect(overlay)
        }
        return
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedOverlay || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min((e.clientX - rect.left) / scale - dragOffset.x, canvasRef.current.width))
    const y = Math.max(0, Math.min((e.clientY - rect.top) / scale - dragOffset.y, canvasRef.current.height))

    onOverlayMove(draggedOverlay, x, y)
  }

  const handleMouseUp = () => {
    setDraggedOverlay(null)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">🎨 محرر الصور المتقدم</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition"
          >
            −
          </button>
          <span className="px-3 py-2 bg-gray-100 rounded text-sm min-w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale(Math.min(2, scale + 0.1))}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition"
          >
            +
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative bg-gray-100 rounded-lg overflow-auto"
        style={{ height: '600px' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          className="cursor-move"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            display: 'block',
          }}
        />
      </div>

      {/* Overlays Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded text-sm text-gray-700">
        📝 {overlays.length} نصوص · اسحب النصوص لتحريكها · استخدم شريط الأدوات العائم للتحكم
      </div>
    </div>
  )
}
