import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Typography, Card, Alert, Tag } from 'antd'
import { PageHeader, JumpBar } from '../components/common'
import { newpets } from '../data'

const { Title, Text } = Typography

export default function NewPets() {
  const loc = useLocation()
  useEffect(() => {
    if (loc.hash) {
      const id = decodeURIComponent(loc.hash.slice(1))
      const el = document.getElementById(id)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [loc.hash])

  return (
    <div>
      <PageHeader title="新宠技能库" sub="超神宠与卡片宠的技能详情、获取方式（整理自《遗迹口袋百科·新宠》）" />
      <Alert type="info" showIcon style={{ marginBottom: 14 }}
        message="技能描述中括号内为满级数值；底部绿色为获取/涅槃方式。" />

      <JumpBar items={newpets.map((s, i) => ({ id: `ns${i}`, label: s.title }))} />

      {newpets.map((s, i) => (
        <div key={s.title} id={`ns${i}`} style={{ marginBottom: 22 }}>
          <Title level={3}>{s.title} <Tag>{s.cards.length}</Tag></Title>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
            {s.cards.map((c, i) => (
              <Card size="small" key={i} title={c.name}>
                {c.skills.map((sk, j) => (
                  <div key={j} style={{ fontSize: 13, marginBottom: 4 }}>
                    <Text strong>{sk.name}</Text>{sk.desc && <Text type="secondary">：{sk.desc}</Text>}
                  </div>
                ))}
                {c.obtain.length > 0 && (
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed rgba(127,127,127,.25)' }}>
                    {c.obtain.map((o, k) => (
                      <div key={k} style={{ fontSize: 12.5, color: '#3aa76d' }}>{o}</div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
