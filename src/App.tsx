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

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    const nextImage = new Image()
    nextImage.onload = () => {
      setImage(nextImage)
      setFileName(file.name)
      setScale(1)
      setOffsetX(0)
      setOffsetY(0)
      setNotice('')
      setShareFallbackUrl('')
      URL.revokeObjectURL(url)
    }
    nextImage.onerror = () => {
      setNotice('画像を読み込めませんでした')
      setShareFallbackUrl('')
      URL.revokeObjectURL(url)
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
        <a className="brand" href="/" aria-label="エンタジェネレーター ホーム"><span>ENTA</span> GENERATOR</a>
        <p>写真 × ことばで、<br />あの一枚を。</p>
      </header>
      <main>
        <section className="hero">
          <div className="eyebrow"><i /> BROWSER IMAGE MAKER</div>
          <h1>エンタ<br /><em>ジェネレーター</em></h1>
          <p>写真を選んで、ことばを添える。<br />あなただけの一枚を、かんたんに。</p>
        </section>

        <div className="workspace">
          <Controls {...{ leftText, rightText, scale, offsetX, offsetY, fileName }} onUpload={handleUpload} onLeftText={setLeftText} onRightText={setRightText} onScale={setScale} onOffsetX={setOffsetX} onOffsetY={setOffsetY} />
          <div className="result-column">
            <CanvasPreview {...{ image, leftText, rightText, scale, offsetX, offsetY, canvasRef }} />
            <div className="actions">
              <button className="save" onClick={() => canvasRef.current && downloadImage(canvasRef.current)}><span>↓</span> PNGで保存</button>
              <button className="share" onClick={handleShare}><span>↗</span> 共有する</button>
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
      <footer><span>画像は端末内で処理され、サーバーには送信されません。</span><b>© ENTA GENERATOR</b></footer>
    </>
  )
}

export default App
