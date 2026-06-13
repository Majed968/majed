import React, { useState, useRef } from 'react'
import { Save, Download, Plus, Trash2, Copy } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  data: {
    overlays: any[]
    markupPercent: number
    additionalTexts: string[]
    imageTexts: string[]
  }
  createdAt: Date
  thumbnail?: string
}

interface TemplateManagerProps {
  onLoadTemplate: (template: Template) => void
  currentData: any
}

export default function TemplateManager({ onLoadTemplate, currentData }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [showModal, setShowModal] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [templateDescription, setTemplateDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load templates from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('marketing_app_templates')
    if (saved) {
      setTemplates(JSON.parse(saved))
    }
  }, [])

  // Save templates to localStorage
  const saveTemplate = () => {
    if (!templateName.trim()) {
      alert('الرجاء إدخال اسم القالب')
      return
    }

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: templateName,
      description: templateDescription,
      data: currentData,
      createdAt: new Date(),
      thumbnail: currentData.thumbnail,
    }

    const updated = [...templates, newTemplate]
    setTemplates(updated)
    localStorage.setItem('marketing_app_templates', JSON.stringify(updated))
    
    setTemplateName('')
    setTemplateDescription('')
    setShowModal(false)
    alert('✅ تم حفظ القالب بنجاح!')
  }

  const deleteTemplate = (id: string) => {
    const updated = templates.filter(t => t.id !== id)
    setTemplates(updated)
    localStorage.setItem('marketing_app_templates', JSON.stringify(updated))
  }

  const duplicateTemplate = (template: Template) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (نسخة)`,
      createdAt: new Date(),
    }
    const updated = [...templates, newTemplate]
    setTemplates(updated)
    localStorage.setItem('marketing_app_templates', JSON.stringify(updated))
  }

  const exportTemplate = (template: Template) => {
    const dataStr = JSON.stringify(template, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${template.name}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string)
        imported.id = Date.now().toString()
        imported.createdAt = new Date()
        
        const updated = [...templates, imported]
        setTemplates(updated)
        localStorage.setItem('marketing_app_templates', JSON.stringify(updated))
        alert('✅ تم استيراد القالب بنجاح!')
      } catch (error) {
        alert('❌ خطأ في الملف المستورد')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">💾 إدارة القوالب</h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Save size={18} /> حفظ قالب جديد
        </button>
      </div>

      {/* Save Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold mb-4">💾 حفظ قالب جديد</h4>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم القالب</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="مثلاً: قالب المنتجات الإلكترونية"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  placeholder="وصف القالب (اختياري)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none h-24"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveTemplate}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                ✅ حفظ
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>📭 لا توجد قوالب محفوظة</p>
          <p className="text-sm mt-2">ابدأ بحفظ قالبك الأول الآن</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{template.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(template.createdAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onLoadTemplate(template)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                >
                  📥 تحميل
                </button>
                <button
                  onClick={() => duplicateTemplate(template)}
                  className="px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition"
                  title="نسخ"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => exportTemplate(template)}
                  className="px-3 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
                  title="تصدير"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
                  title="حذف"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Import Button */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          📂 استيراد قالب
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={importTemplate}
          className="hidden"
        />
      </div>
    </div>
  )
}
