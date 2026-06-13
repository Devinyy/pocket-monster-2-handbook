import { useEffect, type CSSProperties } from 'react'
import { useLocation } from 'react-router-dom'
import { Typography, Alert, Card, Tag, Image, Empty } from 'antd'
import { PageHeader, JumpBar } from '../components/common'
import { petsDetail, imgUrl } from '../data'
import type { PetDetail } from '../data'
import { seriesColor } from '../elements'

const { Title, Text } = Typography

function PetCard({ pet, cc }: { pet: PetDetail; cc: string }) {
  return (
    <Card
      size="small"
      hoverable
      className="pet-card"
      style={{ ['--cc']: cc } as CSSProperties}
      styles={{ body: { padding: 14 } }}
      cover={
        <div className="pet-sprite-wrap" style={{
          height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 38%, rgba(91,124,255,.12), rgba(91,124,255,0) 70%)',
          padding: 10,
        }}>
          {pet.sprite
            ? <Image src={imgUrl('petsprite', pet.sprite)} alt={pet.name} loading="lazy"
                style={{ maxHeight: 130, width: 'auto', objectFit: 'contain' }} />
            : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无立绘" />}
        </div>
      }
    >
      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{pet.name}</div>
      {pet.skills.length > 0 ? pet.skills.map((sk, j) => (
        <div key={j} style={{ fontSize: 12.5, marginBottom: 4, lineHeight: 1.55 }}>
          <Text strong>{sk.name}</Text>
          {sk.desc && <Text type="secondary">：{sk.desc}</Text>}
        </div>
      )) : <Text type="secondary" style={{ fontSize: 12.5 }}>技能未收录</Text>}
      {pet.obtain.length > 0 && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed rgba(127,127,127,.25)' }}>
          {pet.obtain.map((o, k) => (
            <div key={k} style={{ fontSize: 12, color: '#3aa76d' }}>{o}</div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default function Pets() {
  const loc = useLocation()
  useEffect(() => {
    if (loc.hash) {
      const el = document.getElementById(loc.hash.slice(1))
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [loc.hash])

  const total = petsDetail.reduce((a, s) => a + s.pets.length, 0)

  return (
    <div>
      <PageHeader title="宠物图鉴" sub={`仙侠 · 女神 · 封神 · 三国 等系列共 ${total} 只神宠，技能与立绘逐只整理`} />
      <Alert type="info" showIcon style={{ marginBottom: 14 }}
        message="一宠一卡：文字为解析渲染，立绘点击可放大。整理自《口袋百科重制版·宠物篇》。" />

      <JumpBar items={petsDetail.map((s, i) => ({ id: `ps${i}`, label: `${s.series}(${s.pets.length})` }))} />

      <Image.PreviewGroup>
        {petsDetail.map((s, i) => (
          <div key={i} id={`ps${i}`} style={{ marginBottom: 28 }}>
            <Title level={3} style={{ marginBottom: 12 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: seriesColor(i), marginRight: 8, verticalAlign: 'middle' }} />
              {s.series} <Tag color="blue">{s.pets.length}</Tag>
            </Title>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14 }}>
              {s.pets.map((p, j) => <PetCard key={j} pet={p} cc={seriesColor(i)} />)}
            </div>
          </div>
        ))}
      </Image.PreviewGroup>
    </div>
  )
}
