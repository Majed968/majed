export interface Product {
  id: string
  text: string
  prices: Price[]
  images: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Price {
  amount: number
  currency: string
  original: string
}

export interface ProcessingOptions {
  markupPercent: number
  autoFormat: boolean
  addEmojis: boolean
  colorizeLines: boolean
  suggestMarketing: boolean
}

export interface TextOverlay {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontColor: string
  backgroundColor: string
}
