import React, { useState } from 'react'
import { Download, Share2, FileJson, ImageIcon, Loader } from 'lucide-react'
import html2canvas from 'html2canvas'

interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf' | 'json'
  quality: number
  includeWatermark: boolean
}

interface ExportManagerProps {
  text: string
  images: File[]
  overlays: any[]
}

export default function ExportManager({ text, images, overlays }: ExportManagerProps) {
  const [exporting, setExporting] = useState(false)
  const [options, setOptions] = useState<ExportOptions>({
    format: 'png',
    quality: 95,
    includeWatermark: false,
  })

  const exportAsImage = async () => {
    setExporting(true)
    try {
      const element = document.getElementById('export-content')
      if (!element) {
        alert('لم يتم العثور على المحتوى')
        return
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true,
      })

      const link = document.createElement('a')
      link.href = canvas.toDataURL(`image/${options.format}`)
      link.download = `تصدير_${new Date().getTime()}.${options.format}`
      link.click()
    } catch (error) {
      console.error('Export error:', error)
      alert('❌ حدث خطأ في التصدير')
    } finally {
      setExporting(false)
    }
  }

  const exportAsJSON = () => {
    const data = {
      text,
      overlays,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    }
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `تصدير_${new Date().getTime()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportAsCSV = () => {
    const csvContent = [
      ['النص', 'الموضع X', 'الموضع Y', 'حجم ا��خط', 'اللون', 'الخلفية'],
      ...overlays.map(o => [
        o.text,
        o.x,
        o.y,
        o.fontSize,
        o.fontColor,
        o.backgroundColor,
      ]),
    ]
    
    const csv = csvContent
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `تصدير_${new Date().getTime()}.csv`
    link.click()
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border border-green-200">
      <div className="flex items-center gap-2 mb-4">
        <Download className="text-green-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">📥 تصدير واستخراج</h3>
      </div>

      <div className="space-y-4">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">📋 صيغة التصدير</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { format: 'png', label: 'PNG', icon: '🖼️' },
              { format: 'jpg', label: 'JPG', icon: '📸' },
              { format: 'pdf', label: 'PDF', icon: '📄' },
              { format: 'json', label: 'JSON', icon: '⚙️' },
            ].map(({ format, label, icon }) => (
              <button
                key={format}
                onClick={() => setOptions({ ...options, format: format as any })}
                className={`p-3 rounded-lg transition font-medium ${
                  options.format === format
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-green-400'
                }`}
              >
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xs">{label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quality Slider */}
        {(options.format === 'png' || options.format === 'jpg') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📊 جودة الصورة</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50"
                max="100"
                value={options.quality}
                onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-lg font-bold text-green-600 min-w-12">{options.quality}%</span>
            </div>
          </div>
        )}

        {/* Watermark */}
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
          <input
            type="checkbox"
            id="watermark"
            checked={options.includeWatermark}
            onChange={(e) => setOptions({ ...options, includeWatermark: e.target.checked })}
            className="w-5 h-5 cursor-pointer"
          />
          <label htmlFor="watermark" className="flex-1 cursor-pointer text-sm font-medium text-gray-700">
            💧 إضافة العلامة المائية
          </label>
        </div>

        {/* Export Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-green-200">
          {options.format === 'json' ? (
            <button
              onClick={exportAsJSON}
              disabled={exporting}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
            >
              {exporting ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  جاري التصدير...
                </>
              ) : (
                <>
                  <FileJson size={18} />
                  تصدير JSON
                </>
              )}
            </button>
          ) : (
            <button
              onClick={exportAsImage}
              disabled={exporting}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium"
            >
              {exporting ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  جاري التصدير...
                </>
              ) : (
                <>
                  <ImageIcon size={18} />
                  تصدير {options.format.toUpperCase()}
                </>
              )}
            </button>
          )}

          <button
            onClick={exportAsCSV}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
          >
            📊 تصدير إلى CSV
          </button>
        </div>
      </div>

      {/* Hidden export container */}
      <div id="export-content" className="hidden p-8 bg-white">
        <h2 className="text-2xl font-bold mb-4">{text.substring(0, 50)}</h2>
        <p className="whitespace-pre-wrap text-gray-700">{text}</p>
        {options.includeWatermark && (
          <p className="mt-8 text-sm text-gray-400 text-right">🚀 تم التصدير من تطبيق التسويق الاحترافي</p>
        )}
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-white rounded-lg text-sm text-gray-700 border border-green-200">
        ℹ️ اختر الصيغة المناسبة لاحتياجاتك: PNG/JPG للصور، JSON لحفظ البيانات، CSV للجداول
      </div>
    </div>
  )
}
