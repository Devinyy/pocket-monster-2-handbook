import { Typography, Table, Alert } from 'antd'
import { PageHeader, Gallery } from '../components/common'
import { boss, galleries } from '../data'
import type { BossRow } from '../data'

const { Title } = Typography

const fmt = (s: string) => (s ? Number(s.replace(/,/g, '')).toLocaleString() : '')

const columns = [
  { title: '地点', dataIndex: 'place', key: 'place', width: 120 },
  { title: 'BOSS', dataIndex: 'boss', key: 'boss', render: (v: string) => v.replace(/[§]/g, '') },
  { title: '普通', dataIndex: 'normal', key: 'normal', align: 'right' as const,
    render: (v: string, r: BossRow) => (v ? fmt(v) : r.single ? fmt(r.single) : '—') },
  { title: '困难', dataIndex: 'hard', key: 'hard', align: 'right' as const, render: (v: string) => (v ? fmt(v) : '—') },
  { title: '冒险', dataIndex: 'adv', key: 'adv', align: 'right' as const, render: (v: string) => (v ? fmt(v) : '—') },
]

export default function Boss() {
  return (
    <div>
      <PageHeader title="BOSS 图鉴" sub="旧大陆 · 新大陆 · 神圣地图 BOSS 与各难度血量" />
      <Alert type="info" showIcon style={{ marginBottom: 14 }}
        message="部分旧大陆 BOSS 无难度区分，血量显示在「普通」列。" />

      {boss.map((region) => (
        <div key={region.region} style={{ marginBottom: 22 }}>
          <Title level={3}>{region.region}</Title>
          <Table size="small" pagination={false} scroll={{ x: 'max-content' }}
            columns={columns} rowKey={(r) => r.place + r.boss}
            dataSource={region.rows.map((r, i) => ({ ...r, key: i }))} />
        </div>
      ))}

      <Title level={3}>原始图鉴</Title>
      <Gallery folder="boss" items={galleries.boss.map((f) => ({ img: f }))} />
    </div>
  )
}
