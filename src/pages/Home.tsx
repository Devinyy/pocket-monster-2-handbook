import { Card, Col, Row, Typography, Statistic, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { petsDetail, newpets, boss, exp } from '../data'

const { Title, Paragraph } = Typography

const CATS = [
  { path: '/guide', emoji: '🌱', title: '新手入门', desc: '充值 / 交易 / 合成 / 涅槃 / 装备全流程' },
  { path: '/synthesis', emoji: '⚗️', title: '合成 · 涅槃', desc: '全套合成与涅槃公式、养成专题链' },
  { path: '/pets', emoji: '🐲', title: '宠物图鉴', desc: '仙侠 / 女神 / 封神 / 三国 系列大百科' },
  { path: '/newpets', emoji: '✨', title: '新宠技能库', desc: '超神宠与卡片宠技能详情、获取方式' },
  { path: '/tasks', emoji: '📜', title: '专属任务', desc: '各神宠专属任务完整步骤' },
  { path: '/boss', emoji: '👹', title: 'BOSS 图鉴', desc: '三大区域 BOSS 与各难度血量' },
  { path: '/equipment', emoji: '🛡️', title: '装备 · 卡片', desc: '逐光服全套装 / 卡套与搭配参考' },
  { path: '/data', emoji: '📊', title: '数值工具', desc: '经验表 · 物价 · 伤害公式' },
]

const FEATURES = [
  { emoji: '🗺️', t: '野外探险', d: '回合制战斗，多种地图，手动/自动战斗，捕捉宠物、击败 BOSS 获取道具与装备。' },
  { emoji: '🐾', t: '宠物养成', d: '升级、进化、佩戴装备、学习技能，宠物合成与涅槃获取更多种类的神宠。' },
  { emoji: '🏯', t: '中心城镇', d: '牧场、仓库、商店、铁匠铺、皇宫、宠物神殿等满足你的交互需求。' },
  { emoji: '📋', t: '任务系统', d: '剧情、日常、兑换、宠物专属任务，合理搭配让游戏体验更惬意。' },
]

export default function Home() {
  const navigate = useNavigate()
  const petCount = petsDetail.reduce((a, s) => a + s.pets.length, 0)
  const skillCount = newpets.reduce((a, s) => a + s.cards.length, 0)
  const bossCount = boss.reduce((a, r) => a + r.rows.filter((x) => x.boss).length, 0)

  return (
    <div>
      <div className="hero">
        <Title level={1} style={{ color: '#fff', marginTop: 0 }}>口袋怪兽2 · 攻略图鉴 Wiki</Title>
        <Paragraph style={{ color: 'rgba(255,255,255,.92)', fontSize: 16, maxWidth: 680 }}>
          超可爱宠物养成 RPG —— 宠物图鉴、合成涅槃公式、专属任务、BOSS 血量、装备卡片与数值工具，一站式查询。
        </Paragraph>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Tag color="white" style={{ color: '#4b6cff', fontWeight: 600 }}>双端适配</Tag>
          <Tag color="white" style={{ color: '#4b6cff', fontWeight: 600 }}>社区整理</Tag>
          <Tag color="white" style={{ color: '#4b6cff', fontWeight: 600 }}>持续更新</Tag>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: 22 }}>
        <Col xs={12} sm={6}><Card><Statistic title="收录宠物" value={petCount} suffix="只" /></Card></Col>
        <Col xs={12} sm={6}><Card><Statistic title="新宠技能" value={skillCount} suffix="只" /></Card></Col>
        <Col xs={12} sm={6}><Card><Statistic title="BOSS" value={bossCount} suffix="个" /></Card></Col>
        <Col xs={12} sm={6}><Card><Statistic title="经验等级" value={exp.length} suffix="级" /></Card></Col>
      </Row>

      <Title level={3} style={{ marginTop: 30 }}>全部分类</Title>
      <Row gutter={[16, 16]}>
        {CATS.map((c) => (
          <Col xs={12} sm={8} md={6} key={c.path}>
            <Card hoverable onClick={() => navigate(c.path)} style={{ height: '100%' }}>
              <div style={{ fontSize: 30 }}>{c.emoji}</div>
              <div style={{ fontWeight: 600, fontSize: 16, marginTop: 8 }}>{c.title}</div>
              <div style={{ color: '#999', fontSize: 13, marginTop: 4 }}>{c.desc}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Title level={3} style={{ marginTop: 30 }}>游戏特色</Title>
      <Row gutter={[16, 16]}>
        {FEATURES.map((f) => (
          <Col xs={24} sm={12} md={6} key={f.t}>
            <Card style={{ height: '100%' }}>
              <div style={{ fontSize: 28 }}>{f.emoji}</div>
              <div style={{ fontWeight: 600, fontSize: 15, margin: '8px 0 4px' }}>{f.t}</div>
              <div style={{ color: '#999', fontSize: 13 }}>{f.d}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
