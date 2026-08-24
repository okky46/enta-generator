const SHARE_TEXT = 'エンタジェネレーターで画像を作りました'

export interface ShareResult {
  type: 'shared' | 'fallback' | 'cancelled'
  message: string
  fallbackUrl?: string
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('PNGを生成できませんでした')), 'image/png')
  })
}

function getXIntentUrl() {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(window.location.href)}`
}

async function copyShareText() {
  const shareCopy = `${SHARE_TEXT}\n${window.location.href}`
  try {
    await navigator.clipboard.writeText(shareCopy)
    return true
  } catch {
    return false
  }
}

export async function shareImage(canvas: HTMLCanvasElement): Promise<ShareResult> {
  const shareData: ShareData = { title: 'エンタジェネレーター', text: SHARE_TEXT, url: window.location.href }

  if (navigator.share) {
    try {
      const blob = await canvasToBlob(canvas)
      const file = new File([blob], 'enta-generator.png', { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) shareData.files = [file]
      await navigator.share(shareData)
      return { type: 'shared', message: '共有しました' }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { type: 'cancelled', message: '共有をキャンセルしました' }
      }
    }
  }

  const copied = await copyShareText()
  return {
    type: 'fallback',
    message: copied
      ? '共有文をコピーしました。画像を保存して添付し、「Xで共有」を押してください'
      : '画像を保存して添付し、「Xで共有」を押してください',
    fallbackUrl: getXIntentUrl(),
  }
}

export function downloadImage(canvas: HTMLCanvasElement) {
  const link = document.createElement('a')
  link.download = 'enta-generator.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}
