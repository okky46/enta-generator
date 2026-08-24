import { useRef, useState } from 'react'
import { CanvasPreview } from './components/CanvasPreview'
import { Controls } from './components/Controls'
import { downloadImage, shareImage } from './utils/shareImage'

function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [fileName, setFileName] = useState('')
  const [leftText, setLeftText] = useState('左テキスト')
  const [rightText, setRightText] = useState('右テキスト')
  const [scale, setScale] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [notice, setNotice] = useState('')
  const [shareFallbackUrl, setShareFallbackUrl] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const uploadRequestRef = useRef(0)
  const uploadUrlRef = useRef<string | null>(null)

  const handleUpload = (file: File) => {
    const requestId = ++uploadRequestRef.current

    if (uploadUrlRef.current) {
      URL.revokeObjectURL(uploadUrlRef.current)
    }

    const url = URL.createObjectURL(file)
    uploadUrlRef.current = url
    const nextImage = new Image()

    const cleanupUrl = () => {
      URL.revokeObjectURL(url)
      if (uploadUrlRef.current === url) uploadUrlRef.current = null
    }

    nextImage.onload = () => {
      if (requestId !== uploadRequestRef.current) {
        cleanupUrl()
        return
      }

      setImage(nextImage)
      setFileName(file.name)
      setScale(1)
      setOffsetX(0)
      setOffsetY(0)
      setNotice('')
      setShareFallbackUrl('')
      cleanupUrl()
    }

    nextImage.onerror = () => {
      if (requestId !== uploadRequestRef.current) {
        cleanupUrl()
        return
      }

      setNotice('画像を読み込めませんでした')
      setShareFallbackUrl('')
      cleanupUrl()
    }

    nextImage.src = url
  }

  const handleShare = async () => {
    if (!canvasRef.current) return
    setShareFallbackUrl('')
    const result = await shareImage(canvasRef.current)
    setNotice(result.message)
    setShareFallbackUrl(result.fallbackUrl ?? '')
  }

  return (
    <>
      <header>
        <a className="brand" href="/enta/">エンタジェネレーター</a>
      </header>
      <main>
        <div className="intro">
          <h1>画像を作成</h1>
          <p>画像と左右の文字を設定して、PNG画像を作成できます。</p>
        </div>

        <div className="workspace">
          <Controls {...{ leftText, rightText, scale, offsetX, offsetY, fileName }} onUpload={handleUpload} onLeftText={setLeftText} onRightText={setRightText} onScale={setScale} onOffsetX={setOffsetX} onOffsetY={setOffsetY} />
          <div className="result-column">
            <CanvasPreview {...{ image, leftText, rightText, scale, offsetX, offsetY, canvasRef }} />
            <div className="actions">
              <button className="save" onClick={() => canvasRef.current && downloadImage(canvasRef.current)}>PNGで保存</button>
              <button className="share" onClick={handleShare}>共有</button>
            </div>
            {notice && <p className="notice" role="status">{notice}</p>}
            {shareFallbackUrl && (
              <a className="x-share-link" href={shareFallbackUrl} target="_blank" rel="noopener noreferrer">
                Xで共有する
              </a>
            )}
          </div>
        </div>
      </main>
      <footer>画像は端末内で処理され、サーバーには送信されません。</footer>
    </>
  )
}

export default App
