export interface ShareOptions {
  platform: 'facebook' | 'whatsapp' | 'twitter' | 'telegram' | 'linkedin'
  text: string
  imageUrl?: string
}

export const shareContent = async (options: ShareOptions): Promise<boolean> => {
  const { platform, text, imageUrl } = options
  
  try {
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
        return true
      
      case 'facebook':
        return await shareFacebook(text, imageUrl)
      
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
        return true
      
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(text)}`, '_blank')
        return true
      
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(text)}`, '_blank')
        return true
      
      default:
        return false
    }
  } catch (error) {
    console.error('Share error:', error)
    return false
  }
}

const shareFacebook = async (text: string, imageUrl?: string): Promise<boolean> => {
  try {
    if ((window as any).FB && (window as any).FB.ui) {
      (window as any).FB.ui({
        method: 'share',
        href: window.location.href,
        hashtag: '#تسويق',
        quote: text,
        display: 'popup',
      })
      return true
    } else {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
        '_blank'
      )
      return true
    }
  } catch (error) {
    console.error('Facebook share error:', error)
    return false
  }
}

export const downloadFile = (content: string, filename: string, type: string = 'text/plain'): void => {
  const element = document.createElement('a')
  element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export const downloadImage = async (blob: Blob, filename: string): Promise<void> => {
  const url = URL.createObjectURL(blob)
  const element = document.createElement('a')
  element.setAttribute('href', url)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
  URL.revokeObjectURL(url)
}
