export interface TextOverlay {
  text: string
  x: number
  y: number
  fontSize: number
  fontColor: string
  backgroundColor: string
  opacity: number
  padding: number
}

export const drawTextOnImage = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  overlay: TextOverlay
): void => {
  const metrics = context.measureText(overlay.text)
  const textWidth = metrics.width
  const textHeight = overlay.fontSize
  const padding = overlay.padding || 8

  // Draw background
  context.globalAlpha = overlay.opacity
  context.fillStyle = overlay.backgroundColor
  context.fillRect(
    overlay.x - padding,
    overlay.y - textHeight - padding,
    textWidth + padding * 2,
    textHeight + padding * 2
  )

  // Draw text
  context.globalAlpha = 1
  context.fillStyle = overlay.fontColor
  context.font = `${overlay.fontSize}px Arial`
  context.fillText(overlay.text, overlay.x, overlay.y)
}

export const generateImageWithOverlays = async (
  imageUrl: string,
  overlays: TextOverlay[]
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const context = canvas.getContext('2d')
      
      if (!context) {
        resolve(null)
        return
      }

      // Draw original image
      context.drawImage(img, 0, 0)

      // Draw overlays
      overlays.forEach(overlay => {
        drawTextOnImage(canvas, context, overlay)
      })

      // Export as blob
      canvas.toBlob(resolve, 'image/png')
    }
    img.onerror = () => resolve(null)
    img.src = imageUrl
  })
}

export const cropImage = async (
  imageUrl: string,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<Blob | null> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      
      if (!context) {
        resolve(null)
        return
      }

      context.drawImage(img, x, y, width, height, 0, 0, width, height)
      canvas.toBlob(resolve, 'image/png')
    }
    img.onerror = () => resolve(null)
    img.src = imageUrl
  })
}
