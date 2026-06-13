import { useState, useCallback, useRef } from 'react'
import html2canvas from 'html2canvas'

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
}

export const useImageEditor = () => {
  const [overlays, setOverlays] = useState<TextOverlay[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const addTextOverlay = useCallback((text: string) => {
    const newOverlay: TextOverlay = {
      id: Date.now().toString(),
      text,
      x: 10,
      y: 10,
      fontSize: 16,
      fontColor: '#ffffff',
      backgroundColor: 'rgba(0,0,0,0.7)',
      opacity: 1,
      fontFamily: 'Arial',
    }
    setOverlays(prev => [...prev, newOverlay])
  }, [])

  const updateOverlay = useCallback((id: string, updates: Partial<TextOverlay>) => {
    setOverlays(prev => prev.map(overlay => 
      overlay.id === id ? { ...overlay, ...updates } : overlay
    ))
  }, [])

  const removeOverlay = useCallback((id: string) => {
    setOverlays(prev => prev.filter(overlay => overlay.id !== id))
  }, [])

  const exportImage = useCallback(async (imageElement: HTMLElement): Promise<Blob | null> => {
    try {
      const canvas = await html2canvas(imageElement)
      return new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png')
      })
    } catch (error) {
      console.error('Export error:', error)
      return null
    }
  }, [])

  const drawOverlays = useCallback((canvas: HTMLCanvasElement, imageData: string) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      overlays.forEach(overlay => {
        ctx.globalAlpha = overlay.opacity
        ctx.fillStyle = overlay.backgroundColor
        ctx.font = `${overlay.fontSize}px ${overlay.fontFamily}`
        
        // Measure text
        const metrics = ctx.measureText(overlay.text)
        const padding = 8
        
        // Draw background
        ctx.fillRect(
          overlay.x - padding,
          overlay.y - overlay.fontSize - padding,
          metrics.width + padding * 2,
          overlay.fontSize + padding * 2
        )
        
        // Draw text
        ctx.fillStyle = overlay.fontColor
        ctx.globalAlpha = 1
        ctx.fillText(overlay.text, overlay.x, overlay.y)
      })
    }
    img.src = imageData
  }, [overlays])

  return {
    overlays,
    addTextOverlay,
    updateOverlay,
    removeOverlay,
    exportImage,
    drawOverlays,
    canvasRef,
  }
}
