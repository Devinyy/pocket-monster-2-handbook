import { Typography, Card, Alert, Tag, Row, Col, Button } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { PageHeader } from '../components/common'
import {
  SERVER_LINKS, REGISTER_TIPS, SERVER_FEATURES_DETAIL, SERVER_MECHANICS,
  MONTHLY_ACTIVITIES, ACTIVITY_COMMON, PURCHASE_NOTES, UPDATE_NOTES,
} from '../data/server'

const { Title, Paragraph } = Typography

const Bullets = ({ items }: { items: string[] }) => (
  <ul style={{ margin: 0, paddingLeft: 18 }}>
    {items.map((it, i) => <li key={i} style={{ fontSize: 13.5, lineHeight: 1.8 }}>{it}</li>)}
  </ul>
)

export default function Activities() {
  return (
    <div>
      <PageHeader title="本服公告 · 活动" sub="逐光服 · 链接 / 月度活动 / 特色改动 / 长期机制（整理自官方论坛，内容完整）" />

      {/* 快速链接 */}
      <Title level={3} id="links">快速链接</Title>
      <Row gutter={[14, 14]}>
        {SERVER_LINKS.map((l) => (
          <Col xs={24} sm={8} key={l.label}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ fontSize: 24 }}>{l.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, margin: '6px 0 2px' }}>{l.label}</div>
              <div className="card-desc" style={{ marginTop: 0, marginBottom: 10 }}>{l.desc}</div>
              <Button type="primary" size="small" icon={<LinkOutlined />} href={l.url} target="_blank" rel="noreferrer">打开</Button>
            </Card>
          </Col>
        ))}
      </Row>
      <Alert type="info" showIcon style={{ marginTop: 12 }}
        message="区服信息 / 新手须知" description={<Bullets items={REGISTER_TIPS} />} />

      {/* 月度活动（完整） */}
      <Title level={3} id="monthly" style={{ marginTop: 26 }}>月度活动</Title>
      <Row gutter={[14, 14]}>
        {MONTHLY_ACTIVITIES.map((m) => (
          <Col xs={24} key={m.month}>
            <Card size="small" title={<span>{m.title} <Tag color="geekblue">{m.month}</Tag> <Tag>{m.period}</Tag></span>}>
              {m.sections.map((s) => (
                <div key={s.label} style={{ marginBottom: 10 }}>
                  <Paragraph strong style={{ margin: '0 0 4px' }}>{s.label}</Paragraph>
                  <Bullets items={s.items} />
                </div>
              ))}
            </Card>
          </Col>
        ))}
      </Row>

      {/* 活动通用奖励规则（完整） */}
      <Title level={3} id="common" style={{ marginTop: 26 }}>活动通用奖励规则</Title>
      <Alert type="warning" showIcon style={{ marginBottom: 14 }}
        message="以下消费排行榜、消费返利、成长增长排行榜（额外）规则在各月活动中通用，门槛见各月说明。" />
      <Row gutter={[14, 14]}>
        {ACTIVITY_COMMON.map((b) => (
          <Col xs={24} md={8} key={b.title}>
            <Card size="small" title={b.title} style={{ height: '100%' }}><Bullets items={b.items} /></Card>
          </Col>
        ))}
      </Row>

      {/* 长期机制 */}
      <Title level={3} id="mechanics" style={{ marginTop: 26 }}>长期机制</Title>
      <Row gutter={[14, 14]}>
        {SERVER_MECHANICS.map((m) => (
          <Col xs={24} md={8} key={m.title}>
            <Card size="small" title={m.title} style={{ height: '100%' }}>
              <Paragraph style={{ margin: 0, fontSize: 13, lineHeight: 1.8 }}>{m.desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 本服特色改动（全 22 条） */}
      <Title level={3} id="features" style={{ marginTop: 26 }}>本服特色改动</Title>
      <Row gutter={[14, 14]}>
        {SERVER_FEATURES_DETAIL.map((g) => (
          <Col xs={24} md={12} key={g.title}>
            <Card size="small" title={g.title} style={{ height: '100%' }}><Bullets items={g.items} /></Card>
          </Col>
        ))}
      </Row>

      {/* 更新日志 + 抢购 */}
      <Title level={3} id="updates" style={{ marginTop: 26 }}>更新日志与抢购说明</Title>
      <Row gutter={[14, 14]}>
        <Col xs={24} md={16}>
          <Card size="small" title="更新日志要点" style={{ height: '100%' }}><Bullets items={UPDATE_NOTES} /></Card>
        </Col>
        <Col xs={24} md={8}>
          <Card size="small" title="抢购说明" style={{ height: '100%' }}><Bullets items={PURCHASE_NOTES} /></Card>
        </Col>
      </Row>

      <Paragraph type="secondary" style={{ marginTop: 16, fontSize: 12 }}>
        进阶合成 / 涅槃公式见 <a href="#/synthesis">合成 · 涅槃</a> 页「逐光服进阶公式」。资料整理自论坛，可能随版本更新。
      </Paragraph>
    </div>
  )
}
