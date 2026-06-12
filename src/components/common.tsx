import { Typography, Image } from 'antd'
import type { Formula } from '../data/formulas'
import { imgUrl } from '../data'

const { Title, Paragraph } = Typography

export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <Title level={2} style={{ marginBottom: 2 }}>{title}</Title>
      {sub && <Paragraph type="secondary" style={{ marginBottom: 0 }}>{sub}</Paragraph>}
    </div>
  )
}

export function FormulaRow({ f }: { f: Formula }) {
  return (
    <div className="formula-row">
      {f.left.map((x, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {i > 0 && <span className="op">+</span>}
          <span className="chip">{x}</span>
        </span>
      ))}
      <span className="op">=</span>
      <span className="chip chip-res">{f.res}</span>
    </div>
  )
}

export function FormulaList({ rows }: { rows: Formula[] }) {
  return <div>{rows.map((f, i) => <FormulaRow key={i} f={f} />)}</div>
}

// 图片图集：folder 对应 public/img/<folder>，files 为文件名数组
export function Gallery({
  folder, items,
}: { folder: string; items: { img: string; cap?: string; id?: string }[] }) {
  return (
    <Image.PreviewGroup>
      <div className="atlas-grid">
        {items.map((it, i) => (
          <div className="atlas-card" key={i} id={it.id}>
            <Image src={imgUrl(folder, it.img)} alt={it.cap || ''} loading="lazy" style={{ display: 'block' }} />
            {it.cap && <div className="cap">{it.cap}</div>}
          </div>
        ))}
      </div>
    </Image.PreviewGroup>
  )
}
