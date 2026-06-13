import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface TextToolsProps {
  additionalTexts: string[]
  setAdditionalTexts: (texts: string[]) => void
  imageTexts: string[]
  setImageTexts: (texts: string[]) => void
}

export default function TextTools({ additionalTexts, setAdditionalTexts, imageTexts, setImageTexts }: TextToolsProps) {
  const [newText, setNewText] = useState('')
  const [newImageText, setNewImageText] = useState('')

  const addText = (text: string, isList: boolean) => {
    if (text.trim()) {
      if (isList) {
        setAdditionalTexts([...additionalTexts, text])
      } else {
        setImageTexts([...imageTexts, text])
      }
    }
  }

  const removeText = (index: number, isList: boolean) => {
    if (isList) {
      setAdditionalTexts(additionalTexts.filter((_, i) => i !== index))
    } else {
      setImageTexts(imageTexts.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="space-y-6">
      {/* Additional Texts for Description */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">➕ نصوص إضافية للمنشور</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="رقم هاتف، عنوان، خدمة..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addText(newText, true)
                setNewText('')
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              addText(newText, true)
              setNewText('')
            }}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {additionalTexts.map((text, idx) => (
            <div key={idx} className="flex items-center justify-between bg-blue-50 p-2 rounded border border-blue-200">
              <span className="text-sm text-gray-700">{text}</span>
              <button
                onClick={() => removeText(idx, true)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Texts for Images */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">➕ نصوص إضافية للصور</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newImageText}
            onChange={(e) => setNewImageText(e.target.value)}
            placeholder="نص للصور..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addText(newImageText, false)
                setNewImageText('')
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              addText(newImageText, false)
              setNewImageText('')
            }}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {imageTexts.map((text, idx) => (
            <div key={idx} className="flex items-center justify-between bg-purple-50 p-2 rounded border border-purple-200">
              <span className="text-sm text-gray-700">{text}</span>
              <button
                onClick={() => removeText(idx, false)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
