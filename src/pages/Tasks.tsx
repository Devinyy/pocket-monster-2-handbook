import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Typography, Alert, Image } from 'antd'
import { PageHeader, NamePills } from '../components/common'
import { tasksAtlas, imgUrl } from '../data'

const { Title } = Typography

export default function Tasks() {
  const loc = useLocation()
  useEffect(() => {
    if (loc.hash) {
      const el = document.getElementById(loc.hash.slice(1))
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [loc.hash])

  return (
    <div>
      <PageHeader title="专属任务图鉴" sub="各神宠专属任务完整步骤（整理自《口袋精灵全专属任务图鉴》）" />
      <Alert type="info" showIcon style={{ marginBottom: 14 }}
        message="点击下方宠物名跳到对应任务页，点击图片放大查看任务步骤与奖励。" />

      <Title level={3}>宠物索引</Title>
      <div style={{ marginBottom: 18 }}>
        <NamePills items={tasksAtlas.index.map((t) => ({ id: `tp${t.page}`, label: t.name }))} />
      </div>

      <Title level={3}>任务图鉴</Title>
      <Image.PreviewGroup>
        <div className="atlas-grid">
          {tasksAtlas.pages.map((pg) => (
            <div className="atlas-card" key={pg.page} id={`tp${pg.page}`}>
              <Image src={imgUrl('tasks', pg.img)} alt={`第${pg.page}页`} loading="lazy" style={{ display: 'block' }} />
              <div className="cap">第 {pg.page} 页</div>
            </div>
          ))}
        </div>
      </Image.PreviewGroup>
    </div>
  )
}
