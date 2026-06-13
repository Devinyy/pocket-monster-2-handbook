import { useEffect, useState } from 'react'
import { Typography, Image } from 'antd'
import type { Formula } from '../data/formulas'
import { imgUrl, findPet } from '../data'
import { usePetModal } from '../PetModal'
import { LazyImage } from './LazyImage'

const { Title, Paragraph } = Typography

// 合成材料/产物 chip：若能匹配到宠物则点击弹出详情弹窗
function Chip({ text, res }: { text: string; res?: boolean }) {
  const { open } = usePetModal()
  const matched = !!findPet(text)
  const cls = `chip${res ? ' chip-res' : ''}${matched ? ' chip-link' : ''}`
  if (matched) {
    return (
      <span className={cls} role="button" tabIndex={0} title={`查看 ${text} 详情`}
        onClick={() => open(text)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(text) } }}
      >{text}</span>
    )
  }
  return <span className={cls}>{text}</span>
}

// 平滑滚动到页内锚点；阻止默认行为，避免 HashRouter 下 location.hash 被改写导致路由跳变
export function scrollToId(id: string, e?: { preventDefault: () => void }) {
  e?.preventDefault()
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 横向锚点跳转条 + ScrollSpy：当前可视区段对应的 pill 高亮
export function JumpBar({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id)
  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter(Boolean) as HTMLElement[]
    if (!els.length) return
    const obs = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (vis[0]) setActive((vis[0].target as HTMLElement).id)
    }, { rootMargin: '-120px 0px -68% 0px', threshold: 0 })
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [items])

  return (
    <div className="toc-jump">
      {items.map((it) => (
        <a key={it.id} href={`#${it.id}`}
          className={`jump-pill${active === it.id ? ' active' : ''}`}
          onClick={(e) => { scrollToId(it.id, e); setActive(it.id) }}>
          {it.label}
        </a>
      ))}
    </div>
  )
}

// 名称索引药丸（点击平滑滚动到对应锚点）
export function NamePills({ items }: { items: { id: string; label: string }[] }) {
  return (
    <div className="name-pills">
      {items.map((it, i) => (
        <a key={it.id + i} href={`#${it.id}`} onClick={(e) => scrollToId(it.id, e)}>{it.label}</a>
      ))}
    </div>
  )
}

export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="page-header-wrap">
      <span className="glyph">{title.slice(0, 2)}</span>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          fontSize: 10.5, letterSpacing: 3, textTransform: 'uppercase' as const,
          color: 'rgba(255,255,255,.35)', marginBottom: 6,
          fontFamily: "'Space Grotesk', monospace",
        }}>
          Wiki · {title}
        </div>
        <Title level={2} style={{ marginBottom: sub ? 4 : 0, color: '#fff' }}>{title}</Title>
        {sub && <Paragraph style={{ marginBottom: 0, color: 'rgba(255,255,255,.6)', fontSize: 13.5 }}>{sub}</Paragraph>}
      </div>
    </div>
  )
}

export function FormulaRow({ f }: { f: Formula }) {
  return (
    <div className="formula-row">
      {f.left.map((x, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {i > 0 && <span className="op">+</span>}
          <Chip text={x} />
        </span>
      ))}
      <span className="op">=</span>
      <Chip text={f.res} res />
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
            <LazyImage src={imgUrl(folder, it.img)} alt={it.cap || ''} imgStyle={{ display: 'block', width: '100%' }} minHeight={180} />
            {it.cap && <div className="cap">{it.cap}</div>}
          </div>
        ))}
      </div>
    </Image.PreviewGroup>
  )
}
