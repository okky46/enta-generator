export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 900

export interface TemplateOptions {
  image: HTMLImageElement | null
  leftText: string
  rightText: string
  scale: number
  offsetX: number
  offsetY: number
}

const FRAME = { x: 70, y: 70, width: 1060, height: 760 }
const BAND_WIDTH = 170
const RED = '#e60012'

function drawVerticalText(
  context: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  color: string,
) {
  const characters = Array.from(text || '　')
  const maxHeight = FRAME.height - 72
  const fontSize = Math.min(76, maxHeight / Math.max(characters.length, 1) * 0.82)
  const lineHeight = Math.min(86, maxHeight / Math.max(characters.length, 1))
  const startY = FRAME.y + FRAME.height / 2 - ((characters.length - 1) * lineHeight) / 2

  context.save()
  context.fillStyle = color
  context.font = `900 ${fontSize}px "Arial Black", "Noto Sans JP", sans-serif`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  characters.forEach((character, index) => {
    context.fillText(character, centerX, startY + index * lineHeight)
  })
  context.restore()
}

export function drawTemplate(context: CanvasRenderingContext2D, options: TemplateOptions) {
  const { image, leftText, rightText, scale, offsetX, offsetY } = options
  const imageX = FRAME.x + BAND_WIDTH
  const imageWidth = FRAME.width - BAND_WIDTH * 2

  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  context.fillStyle = '#050505'
  context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  context.save()
  context.beginPath()
  context.rect(imageX, FRAME.y, imageWidth, FRAME.height)
  context.clip()

  if (image) {
    const coverScale = Math.max(imageWidth / image.naturalWidth, FRAME.height / image.naturalHeight)
    const drawnWidth = image.naturalWidth * coverScale * scale
    const drawnHeight = image.naturalHeight * coverScale * scale
    const x = imageX + (imageWidth - drawnWidth) / 2 + (offsetX / 100) * imageWidth
    const y = FRAME.y + (FRAME.height - drawnHeight) / 2 + (offsetY / 100) * FRAME.height
    context.drawImage(image, x, y, drawnWidth, drawnHeight)
  } else {
    context.fillStyle = '#202020'
    context.fillRect(imageX, FRAME.y, imageWidth, FRAME.height)
    context.strokeStyle = '#555'
    context.lineWidth = 4
    context.setLineDash([18, 14])
    context.strokeRect(imageX + 48, FRAME.y + 48, imageWidth - 96, FRAME.height - 96)
    context.fillStyle = '#aaa'
    context.font = '700 34px sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText('画像をアップロード', imageX + imageWidth / 2, FRAME.y + FRAME.height / 2)
  }
  context.restore()

  context.fillStyle = '#050505'
  context.fillRect(FRAME.x, FRAME.y, BAND_WIDTH, FRAME.height)
  context.fillStyle = RED
  context.fillRect(FRAME.x + FRAME.width - BAND_WIDTH, FRAME.y, BAND_WIDTH, FRAME.height)

  drawVerticalText(context, leftText, FRAME.x + BAND_WIDTH / 2, RED)
  drawVerticalText(context, rightText, FRAME.x + FRAME.width - BAND_WIDTH / 2, '#fff')
}
