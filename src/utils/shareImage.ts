const SHARE_TEXT = 'エンタジェネレーターで画像を作りました'

export interface ShareResult {
  type: 'shared' | 'fallback' | 'cancelled'
  message: string
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('PNGを生成できませんでした')), 'image/png')
  })
}

export async function shareImage(canvas: HTMLCanvasElement): Promise<ShareResult> {
  const blob = await canvasToBlob(canvas)
  const file = new File([blob], 'enta-generator.png', { type: 'image/png' })
  const shareData: ShareData = { title: 'エンタジェネレーター', text: SHARE_TEXT, url: window.location.href }

  if (navigator.share) {
    try {
      if (navigator.canShare?.({ files: [file] })) shareData.files = [file]
      await navigator.share(shareData)
      return { type: 'shared', message: '共有しました' }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { type: 'cancelled', message: '共有をキャンセルしました' }
      }
    }
  }

  const shareCopy = `${SHARE_TEXT}\n${window.location.href}`
  try { await navigator.clipboard.writeText(shareCopy) } catch { /* URL still opens below. */ }
  const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(window.location.href)}`
  window.open(intent, '_blank', 'noopener,noreferrer')
  return { type: 'fallback', message: '画像を保存して添付してください。共有文をコピーし、Xを開きました' }
}

export function downloadImage(canvas: HTMLCanvasElement) {
  const link = document.createElement('a')
  link.download = 'enta-generator.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}
