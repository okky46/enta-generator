interface Props {
  leftText: string
  rightText: string
  scale: number
  offsetX: number
  offsetY: number
  fileName: string
  onUpload: (file: File) => void
  onLeftText: (value: string) => void
  onRightText: (value: string) => void
  onScale: (value: number) => void
  onOffsetX: (value: number) => void
  onOffsetY: (value: number) => void
}

function RangeControl({ label, value, min, max, step = 1, unit = '', onChange }: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (value: number) => void
}) {
  return (
    <label className="range-control">
      <span><b>{label}</b><output>{value}{unit}</output></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  )
}

export function Controls(props: Props) {
  const limitText = (value: string) => Array.from(value).slice(0, 15).join('')

  return (
    <section className="controls" aria-label="画像編集">
      <div className="control-section upload-section">
        <div>
          <h2>画像を選ぶ</h2>
          <p>端末内の画像だけを使用します</p>
        </div>
        <label className="upload-button">
          <input type="file" accept="image/*" onChange={(event) => event.target.files?.[0] && props.onUpload(event.target.files[0])} />
          <span>画像をアップロード</span>
        </label>
        {props.fileName && <span className="file-name">{props.fileName}</span>}
      </div>

      <div className="control-section">
        <div><h2>文字を入れる</h2><p>帯に表示する縦書き文字</p></div>
        <div className="text-fields">
          <label>左の文字<input value={props.leftText} maxLength={15} onChange={(e) => props.onLeftText(limitText(e.target.value))} /></label>
          <label>右の文字<input value={props.rightText} maxLength={15} onChange={(e) => props.onRightText(limitText(e.target.value))} /></label>
        </div>
      </div>

      <div className="control-section">
        <div><h2>構図を整える</h2><p>画像の大きさと位置を調整</p></div>
        <div className="ranges">
          <RangeControl label="拡大率" value={props.scale} min={1} max={3} step={0.05} unit="×" onChange={props.onScale} />
          <RangeControl label="左右" value={props.offsetX} min={-50} max={50} unit="%" onChange={props.onOffsetX} />
          <RangeControl label="上下" value={props.offsetY} min={-50} max={50} unit="%" onChange={props.onOffsetY} />
        </div>
      </div>
    </section>
  )
}
