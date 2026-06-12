import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Typography, Anchor, Alert, Image } from 'antd'
import { PageHeader } from '../components/common'
import { petsAtlas, imgUrl } from '../data'

const { Title } = Typography

export default function Pets() {
  const loc = useLocation()
  useEffect(() => {
    if (loc.hash) {
      const el = document.getElementById(loc.hash.slice(1))
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [loc.hash])

  return (
    <div>
      <PageHeader title="宠物图鉴" sub="仙侠 · 女神 · 封神 · 三国 等系列神宠大百科（整理自《口袋百科重制版·宠物篇》）" />
      <Alert type="info" showIcon style={{ marginBottom: 14 }}
        message="按系列分组，点击宠物名跳到对应图鉴页，点击图片可放大查看技能详情。" />

      <Anchor direction="horizontal" style={{ marginBottom: 16 }}
        items={petsAtlas.map((s, i) => ({ key: `s${i}`, href: `#s${i}`, title: s.series }))} />

      <Image.PreviewGroup>
        {petsAtlas.map((s, i) => (
          <div key={i} id={`s${i}`} style={{ scrollMarginTop: 80, marginBottom: 26 }}>
            <Title level={3}>{s.series}</Title>
            <div className="name-pills" style={{ marginBottom: 10 }}>
              {s.pets.map((p) => (
                <a key={p.name} href={`#p${p.page}`}>{p.name}</a>
              ))}
            </div>
            <div className="atlas-grid">
              {s.pages.map((pg) => (
                <div className="atlas-card" key={pg.page} id={`p${pg.page}`} style={{ scrollMarginTop: 80 }}>
                  <Image src={imgUrl('pets', pg.img)} alt={`第${pg.page}页`} loading="lazy" style={{ display: 'block' }} />
                  <div className="cap">第 {pg.page} 页</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Image.PreviewGroup>
    </div>
  )
}
