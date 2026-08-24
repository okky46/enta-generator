const SHARE_TEXT = 'エンタジェネレーターで画像を作りました'

export interface ShareResult {
  type: 'shared' | 'fallback'
  message: string
  fallbackUrl?: string
}

function canvasToPngFile(canvas: HTMLCanvasElement) {
  const dataUrl = canvas.toDataURL('image/png')
  const base64 = dataUrl.split(',')[1]
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return new File([bytes], 'enta-generator.png', { type: 'image/png' })
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
      // Keep all work before navigator.share synchronous so the click's transient
      // user activation is still available on browsers that require it.
      const file = canvasToPngFile(canvas)
      if (navigator.canShare?.({ files: [file] })) shareData.files = [file]
      await navigator.share(shareData)
      return { type: 'shared', message: '共有しました' }
    } catch {
      // AbortError is ambiguous across platforms: it can mean either a user
      // cancellation or that no share target exists. Fall through to the manual
      // X flow so a failed native share never leaves the user without an option.
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
