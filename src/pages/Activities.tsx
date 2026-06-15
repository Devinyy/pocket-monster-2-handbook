import { Typography, Card, Alert, Tag, Row, Col, Timeline, Button } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
import { PageHeader } from '../components/common'
import {
  SERVER_LINKS, REGISTER_TIPS, SERVER_FEATURES_DETAIL, SERVER_MECHANICS,
  MONTHLY_ACTIVITIES, UPDATE_NOTES,
} from '../data/server'

const { Title, Paragraph, Text } = Typography

export default function Activities() {
  return (
    <div>
      <PageHeader title="本服公告 · 活动" sub="逐光服 · 链接 / 特色 / 长期机制 / 月度活动（整理自官方论坛）" />

      {/* 快速链接 */}
      <Title level={3} id="links">快速链接</Title>
      <Row gutter={[14, 14]}>
        {SERVER_LINKS.map((l) => (
          <Col xs={24} sm={8} key={l.label}>
            <Card size="small" style={{ height: '100%' }}>
              <div style={{ fontSize: 24 }}>{l.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, margin: '6px 0 2px' }}>{l.label}</div>
              <div className="card-desc" style={{ marginTop: 0, marginBottom: 10 }}>{l.desc}</div>
              <Button type="primary" size="small" icon={<LinkOutlined />} href={l.url} target="_blank" rel="noreferrer">
                打开
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
      <Alert type="info" showIcon style={{ marginTop: 12 }}
        message="新手须知"
        description={<ul style={{ margin: 0, paddingLeft: 18 }}>{REGISTER_TIPS.map((t, i) => <li key={i}>{t}</li>)}</ul>} />

      {/* 月度活动 */}
      <Title level={3} id="monthly" style={{ marginTop: 26 }}>月度活动</Title>
      <Alert type="warning" showIcon style={{ marginBottom: 14 }}
        message="每月活动结构固定：限时合成 + 消费排行榜 + 消费返利（满 1W/10W/20W/30W 返 25%/30%/40%/50%）+ 成长增长榜额外奖。" />
      <Timeline
        items={MONTHLY_ACTIVITIES.map((m) => ({
          color: 'blue',
          children: (
            <div>
              <Text strong style={{ fontSize: 15 }}>{m.title}</Text> <Tag color="geekblue">{m.month}</Tag>
              <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
                {m.highlights.map((h, i) => <li key={i} style={{ fontSize: 13.5, lineHeight: 1.7 }}>{h}</li>)}
              </ul>
            </div>
          ),
        }))}
      />

      {/* 本服特色改动 */}
      <Title level={3} id="features" style={{ marginTop: 20 }}>本服特色改动</Title>
      <Row gutter={[14, 14]}>
        {SERVER_FEATURES_DETAIL.map((g) => (
          <Col xs={24} md={12} key={g.title}>
            <Card size="small" title={g.title} style={{ height: '100%' }}>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {g.items.map((it, i) => <li key={i} style={{ fontSize: 13, lineHeight: 1.75 }}>{it}</li>)}
              </ul>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 长期机制 */}
      <Title level={3} id="mechanics" style={{ marginTop: 26 }}>长期机制</Title>
      <Row gutter={[14, 14]}>
        {SERVER_MECHANICS.map((m) => (
          <Col xs={24} md={8} key={m.title}>
            <Card size="small" title={m.title} style={{ height: '100%' }}>
              <Paragraph style={{ margin: 0, fontSize: 13, lineHeight: 1.75 }}>{m.desc}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 更新日志 */}
      <Title level={3} id="updates" style={{ marginTop: 26 }}>更新日志要点</Title>
      <Card size="small">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {UPDATE_NOTES.map((u, i) => <li key={i} style={{ fontSize: 13, lineHeight: 1.8 }}>{u}</li>)}
        </ul>
      </Card>

      <Paragraph type="secondary" style={{ marginTop: 16, fontSize: 12 }}>
        进阶合成/涅槃公式见 <a href="#/synthesis">合成 · 涅槃</a> 页「逐光服进阶公式」。资料整理自论坛，可能随版本更新。
      </Paragraph>
    </div>
  )
}
