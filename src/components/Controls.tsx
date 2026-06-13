import React from 'react'
import { Copy, Share2, Download } from 'lucide-react'

interface ControlsProps {
  text: string
  images: File[]
}

export default function Controls({ text, images }: ControlsProps) {
  const copyText = () => {
    navigator.clipboard.writeText(text)
    alert('تم نسخ النص!')
  }

  return (
    <div className="mt-8 flex gap-4 justify-center flex-wrap">
      <button
        onClick={copyText}
        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
      >
        <Copy size={20} /> نسخ النص
      </button>
      <button className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium">
        <Share2 size={20} /> مشاركة
      </button>
      <button className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-medium">
        <Download size={20} /> تنزيل
      </button>
    </div>
  )
}
