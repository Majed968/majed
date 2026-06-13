import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EditorState {
  productText: string
  setProductText: (text: string) => void
  
  images: File[]
  addImages: (files: File[]) => void
  removeImage: (index: number) => void
  
  additionalTexts: string[]
  addAdditionalText: (text: string) => void
  removeAdditionalText: (index: number) => void
  
  imageTexts: string[]
  addImageText: (text: string) => void
  removeImageText: (index: number) => void
  
  processedText: string
  setProcessedText: (text: string) => void
  
  resetEditor: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
  productText: '',
  setProductText: (text) => set({ productText: text }),
  
  images: [],
  addImages: (files) => set((state) => ({ images: [...state.images, ...files] })),
  removeImage: (index) => set((state) => ({
    images: state.images.filter((_, i) => i !== index),
  })),
  
  additionalTexts: [],
  addAdditionalText: (text) => set((state) => ({
    additionalTexts: [...state.additionalTexts, text],
  })),
  removeAdditionalText: (index) => set((state) => ({
    additionalTexts: state.additionalTexts.filter((_, i) => i !== index),
  })),
  
  imageTexts: [],
  addImageText: (text) => set((state) => ({
    imageTexts: [...state.imageTexts, text],
  })),
  removeImageText: (index) => set((state) => ({
    imageTexts: state.imageTexts.filter((_, i) => i !== index),
  })),
  
  processedText: '',
  setProcessedText: (text) => set({ processedText: text }),
  
  resetEditor: () => set({
    productText: '',
    images: [],
    processedText: '',
  }),
}))
