import { useState } from 'react'
import Editor from './components/Editor'
import ImageProcessor from './components/ImageProcessor'
import PriceDetector from './components/PriceDetector'
import TextTools from './components/TextTools'
import Controls from './components/Controls'

function App() {
  const [productText, setProductText] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [processedText, setProcessedText] = useState('')
  const [additionalTexts, setAdditionalTexts] = useState<string[]>([])
  const [imageTexts, setImageTexts] = useState<string[]>([])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900">🎯 تطبيق التسويق الاحترافي</h1>
          <p className="text-gray-600 text-sm mt-1">معالج منتجات متقدم مع كشف أسعار ذكي وتحرير صور احترافي</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Input */}
          <div className="lg:col-span-1 space-y-6">
            <Editor 
              productText={productText}
              setProductText={setProductText}
              images={images}
              setImages={setImages}
            />
            
            <TextTools 
              additionalTexts={additionalTexts}
              setAdditionalTexts={setAdditionalTexts}
              imageTexts={imageTexts}
              setImageTexts={setImageTexts}
            />
          </div>

          {/* Middle - Processing */}
          <div className="lg:col-span-1">
            <PriceDetector 
              text={productText}
              onProcessed={setProcessedText}
            />
          </div>

          {/* Right - Output */}
          <div className="lg:col-span-1">
            <ImageProcessor 
              images={images}
              processedText={processedText}
              additionalTexts={additionalTexts}
              imageTexts={imageTexts}
            />
          </div>
        </div>

        {/* Controls */}
        <Controls 
          text={processedText}
          images={images}
        />
      </main>
    </div>
  )
}

export default App
