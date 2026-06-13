import React from 'react'
import { Download, Share2 } from 'lucide-react'

interface ImageProcessorProps {
  images: File[]
  processedText: string
  additionalTexts: string[]
  imageTexts: string[]
}

export default function ImageProcessor({ images, processedText, additionalTexts, imageTexts }: ImageProcessorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 معاينة الصور</h3>

      {images.length > 0 ? (
        <div className="space-y-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={URL.createObjectURL(img)}
                alt={`Product ${idx + 1}`}
                className="w-full h-auto"
              />
              {/* Text Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {processedText && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded text-sm max-h-24 overflow-auto">
                    <p className="line-clamp-4">{processedText}</p>
                  </div>
                )}
              </div>
              <div className="mt-2 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm">
                  <Download size={16} /> تنزيل
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm">
                  <Share2 size={16} /> مشاركة
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p>📸 لم يتم تحميل أي صور</p>
        </div>
      )}
    </div>
  )
}
