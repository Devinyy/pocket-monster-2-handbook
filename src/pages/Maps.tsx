import { Typography, Card, Tag, Tabs, Table, Alert, Row, Col, Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { PageHeader } from '../components/common'
import { oldMaps, newMaps, dungeons, materials, farmTips, accounts } from '../data/maps'
import type { GameMap } from '../data/maps'
import { ELEM_ANTD, detectElement } from '../elements'
import { useElementFilter } from '../ElementFilter'

const { Title, Text, Paragraph } = Typography

// 从 "鸭子（水）" 中取元素着色；activeEl 设置时非匹配项淡化
function monsterTag(m: string, i: number, activeEl: string | null) {
  const el = detectElement(m) || ''
  const dim = activeEl && el !== activeEl
  return (
    <Tag key={i} color={ELEM_ANTD[el] || 'default'}
      style={{ marginInlineEnd: 6, marginBottom: 6, opacity: dim ? 0.3 : 1, transition: 'opacity .15s' }}>
      {m}
    </Tag>
  )
}

function MapCard({ m, activeEl }: { m: GameMap; activeEl: string | null }) {
  return (
    <Card size="small" style={{ height: '100%' }}
      title={<span>{m.name}{m.meta && <Text type="secondary" style={{ fontWeight: 400, fontSize: 12 }}>　{m.meta}</Text>}</span>}
      extra={m.boss.map((b, i) => <Tag color="red" key={i} style={{ marginInlineEnd: 0, marginLeft: 4 }}>BOSS {b.replace(/§/g, '')}</Tag>)}
    >
      <div style={{ marginBottom: 8 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>怪物</Text>
        <div style={{ marginTop: 4 }}>{m.monsters.map((mm, i) => monsterTag(mm, i, activeEl))}</div>
      </div>
      <div>
        <Text type="secondary" style={{ fontSize: 12 }}>掉落</Text>
        <div style={{ marginTop: 4 }}>
          <Text style={{ fontSize: 12.5 }}>{m.drops.join('、')}</Text>
        </div>
      </div>
    </Card>
  )
}

// 该地图是否含某属性的怪物/BOSS
function mapHasEl(m: GameMap, el: string): boolean {
  return [...m.monsters, ...m.boss].some((x) => detectElement(x) === el)
}

function MapGrid({ maps, activeEl }: { maps: GameMap[]; activeEl: string | null }) {
  const shown = activeEl ? maps.filter((m) => mapHasEl(m, activeEl)) : maps
  if (!shown.length) return <Text type="secondary">该区域暂无「{activeEl}」属性怪物。</Text>
  return (
    <Row gutter={[14, 14]}>
      {shown.map((m) => (
        <Col xs={24} md={12} key={m.name}><MapCard m={m} activeEl={activeEl} /></Col>
      ))}
    </Row>
  )
}

export default function Maps() {
  const { el, setEl } = useElementFilter()
  return (
    <div>
      <PageHeader title="地图图鉴" sub="野外地图怪物与掉落 · 大陆副本 · 材料速查与养号（玩家收集整理）" />
      <Tabs
        items={[
          {
            key: 'wild', label: '🗺️ 地图怪物 & 掉落',
            children: (
              <div>
                {el
                  ? <Alert type="warning" showIcon style={{ marginBottom: 14 }}
                      message={<span>正在按 <b>{el}</b> 属性筛选，仅显示含该属性怪物的地图。</span>}
                      action={<Button size="small" icon={<CloseOutlined />} onClick={() => setEl(null)}>清除</Button>} />
                  : <Alert type="info" showIcon style={{ marginBottom: 14 }}
                      message="怪物按属性着色；BOSS 在右上角标红。可在左侧栏用五系 chip 筛选。" />}
                <Title level={4}>旧大陆</Title>
                <MapGrid maps={oldMaps} activeEl={el} />
                <Title level={4} style={{ marginTop: 20 }}>新大陆</Title>
                <MapGrid maps={newMaps} activeEl={el} />
              </div>
            ),
          },
          {
            key: 'dungeon', label: '🏰 大陆副本',
            children: (
              <div>
                <Alert type="info" showIcon style={{ marginBottom: 14 }}
                  message="副本难度大致由上往下递增。" />
                <Table size="small" pagination={false} rowKey="name"
                  columns={[
                    { title: '副本', dataIndex: 'name', width: 160 },
                    { title: '等级', dataIndex: 'level', width: 80 },
                    { title: 'BOSS', dataIndex: 'boss',
                      render: (bs: string[]) => bs.map((b, i) => <Tag color="red" key={i}>{b}</Tag>) },
                  ]}
                  dataSource={dungeons} />
              </div>
            ),
          },
          {
            key: 'farm', label: '💎 材料速查 & 养号',
            children: (
              <Row gutter={[16, 16]}>
                <Col xs={24} md={13}>
                  <Title level={4}>关键材料 · 刷哪张图</Title>
                  <Table size="small" pagination={false} rowKey="name"
                    columns={[
                      { title: '材料', dataIndex: 'name' },
                      { title: '获取地图', dataIndex: 'where' },
                    ]}
                    dataSource={materials} />
                  <Title level={5} style={{ marginTop: 16 }}>刷图提示</Title>
                  {farmTips.map((t, i) => (
                    <Alert key={i} type="warning" showIcon style={{ marginBottom: 8 }}
                      message={t.replace(/§/g, '')} />
                  ))}
                </Col>
                <Col xs={24} md={11}>
                  <Title level={4}>新手养号账号建议</Title>
                  <Paragraph type="secondary">搬砖 / 养主号常用的小号配置：</Paragraph>
                  {accounts.map((a, i) => (
                    <Card size="small" key={i} style={{ marginBottom: 10 }}>
                      <Text strong>{a.type}</Text>
                      <div style={{ color: '#3aa76d', fontSize: 13, marginTop: 2 }}>{a.detail}</div>
                    </Card>
                  ))}
                </Col>
              </Row>
            ),
          },
        ]}
      />
    </div>
  )
}
