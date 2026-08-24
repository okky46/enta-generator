import { useEffect, useRef } from 'react'
import { CANVAS_HEIGHT, CANVAS_WIDTH, drawTemplate, type TemplateOptions } from '../utils/drawTemplate'

interface Props extends TemplateOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export function CanvasPreview({ canvasRef, ...options }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (context) drawTemplate(context, options)
  }, [canvasRef, options.image, options.leftText, options.rightText, options.scale, options.offsetX, options.offsetY])

  return (
    <div className="preview-card" ref={wrapperRef}>
      <div className="preview-heading">
        <span>プレビュー</span>
        <span className="ratio">4 : 3</span>
      </div>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} aria-label="生成画像のプレビュー" />
    </div>
  )
}
