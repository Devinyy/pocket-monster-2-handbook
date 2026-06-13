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
  { path: '/maps', emoji: '🗺️', title: '地图图鉴', desc: '地图怪物掉落 · 副本 · 材料速查养号' },
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
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: 10.5, letterSpacing: 3, textTransform: 'uppercase' as const,
            color: 'rgba(255,255,255,.6)', marginBottom: 10,
          }}>
            Pocket Monster 2 · Handbook
          </div>
          <Title level={1} style={{ color: '#fff', marginTop: 0, fontSize: 'clamp(26px, 4vw, 38px)', letterSpacing: 1 }}>
            口袋怪兽2 · 攻略图鉴 Wiki
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,.85)', fontSize: 15, maxWidth: 640, lineHeight: 1.7 }}>
            超可爱宠物养成 RPG —— 宠物图鉴、合成涅槃公式、专属任务、BOSS 血量、装备卡片与数值工具，一站式查询。
          </Paragraph>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 18 }}>
            {['双端适配', '社区整理', '持续更新'].map((t) => (
              <Tag key={t} style={{
                background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.2)',
                color: '#fff', borderRadius: 20, padding: '3px 14px', fontWeight: 500,
                backdropFilter: 'blur(4px)',
              }}>{t}</Tag>
            ))}
          </div>
        </div>
      </div>

      <Row gutter={[14, 14]} style={{ marginTop: 20 }} className="stat-row">
        {[
          { title: '收录宠物', value: petCount, suffix: '只' },
          { title: '新宠技能', value: skillCount, suffix: '只' },
          { title: 'BOSS', value: bossCount, suffix: '个' },
          { title: '经验等级', value: exp.length, suffix: '级' },
        ].map((s) => (
          <Col xs={12} sm={6} key={s.title}>
            <Card><Statistic title={s.title} value={s.value} suffix={s.suffix} /></Card>
          </Col>
        ))}
      </Row>

      <Title level={3} style={{ marginTop: 30 }}>全部分类</Title>
      <Row gutter={[14, 14]}>
        {CATS.map((c) => (
          <Col xs={12} sm={8} md={6} key={c.path}>
            <Card hoverable onClick={() => navigate(c.path)} style={{ height: '100%' }} className="cat-card">
              <div style={{ fontSize: 30, marginBottom: 4 }}>{c.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 15.5 }}>{c.title}</div>
              <div className="card-desc">{c.desc}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Title level={3} style={{ marginTop: 30 }}>游戏特色</Title>
      <Row gutter={[14, 14]}>
        {FEATURES.map((f) => (
          <Col xs={24} sm={12} md={6} key={f.t}>
            <Card style={{ height: '100%' }}>
              <div style={{ fontSize: 28 }}>{f.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 15, margin: '8px 0 4px' }}>{f.t}</div>
              <div className="card-desc" style={{ marginTop: 0 }}>{f.d}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
