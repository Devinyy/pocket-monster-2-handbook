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

const SERVER_FEATURES = [
  { emoji: '🏯', t: '圣兽云殿', d: '可获得大量基础资源' },
  { emoji: '💎', t: '折算元宝', d: '聊天等级和装备 5 月折算元宝' },
  { emoji: '🏆', t: '双月涅槃', d: '排名前 100 获得元宝' },
  { emoji: '🎮', t: '原版功能', d: '除琥珀屋和要塞外均保留' },
  { emoji: '🎁', t: '属性祝福', d: '每月更新永久属性祝福任务' },
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

      <Card hoverable onClick={() => navigate('/activities')} className="cat-card"
        style={{ marginTop: 16, cursor: 'pointer' }}
        styles={{ body: { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' } }}>
        <span style={{ fontSize: 30 }}>📢</span>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>本服公告 · 活动</div>
          <div className="card-desc" style={{ marginTop: 2 }}>逐光服最新月度活动、特色改动、长期机制与游戏/论坛/挂机链接</div>
        </div>
        <span style={{ color: 'var(--wiki-accent2, #7b9aff)', fontWeight: 600, whiteSpace: 'nowrap' }}>查看详情 →</span>
      </Card>

      <Row gutter={[14, 14]} style={{ marginTop: 16 }} className="stat-row">
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

      <Title level={3} style={{ marginTop: 30 }}>本服特色</Title>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
        {SERVER_FEATURES.map((f) => (
          <Card key={f.t} style={{ height: '100%' }}>
            <div style={{ fontSize: 26 }}>{f.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: 15, margin: '6px 0 4px' }}>{f.t}</div>
            <div className="card-desc" style={{ marginTop: 0 }}>{f.d}</div>
          </Card>
        ))}
      </div>

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
