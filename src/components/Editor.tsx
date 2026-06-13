import React from 'react'
import { FileUp, Trash2, Plus } from 'lucide-react'

interface EditorProps {
  productText: string
  setProductText: (text: string) => void
  images: File[]
  setImages: (files: File[]) => void
}

export default function Editor({ productText, setProductText, images, setImages }: EditorProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Text Input */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">📝 وصف المنتج</label>
        <textarea
          value={productText}
          onChange={(e) => setProductText(e.target.value)}
          placeholder="الصق وصف المنتج والسعر هنا..."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setProductText('')}
            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            <Trash2 size={16} /> مسح
          </button>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">🖼️ صور المنتج</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <FileUp className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-sm text-gray-600">اسحب الصور هنا أو اضغط للتحميل</p>
          </label>
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="mt-4 space-y-2">
            {images.map((img, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <span className="text-sm text-gray-700">{img.name}</span>
                <button
                  onClick={() => removeImage(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
