import { useMemo, useState } from 'react'
import { Table, InputNumber, Card, Row, Col, Statistic, Button, Space, Alert, Typography, Tag } from 'antd'

const { Text, Paragraph } = Typography

// 来源贡献行（百分比）。默认值复现资料中的示例：
// 100 × (1+617%+400%+30%+25%) × (1+373%+200%+120%+20%+2%) × 4 × 1.5 = 57310.8
interface Row { key: string; name: string; atk: number; dep: number; hit: number }
const DEFAULT_ROWS: Row[] = [
  { key: 'zf', name: '祝福', atk: 0, dep: 0, hit: 46 },
  { key: 'eq', name: '装备', atk: 617, dep: 373, hit: 420 },
  { key: 'gem', name: '宝石', atk: 30, dep: 120, hit: 205 },
  { key: 'card', name: '卡片', atk: 400, dep: 200, hit: 420 },
  { key: 'title', name: '称号', atk: 25, dep: 2, hit: 10 },
  { key: 'skill', name: '技能', atk: 0, dep: 20, hit: 0 },
]
const EMPTY_ROWS: Row[] = DEFAULT_ROWS.map((r) => ({ ...r, atk: 0, dep: 0, hit: 0 }))

const fmt = (n: number) =>
  n.toLocaleString('zh-CN', { maximumFractionDigits: 2 })

export default function DamageCalc() {
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS)
  const [panel, setPanel] = useState<number>(100)   // 牧场面板攻击
  const [floatV, setFloatV] = useState<number>(4)   // 浮动区间
  const [mult, setMult] = useState<number>(1.5)     // 技能 / 暴击倍率

  const setCell = (key: string, field: 'atk' | 'dep' | 'hit', v: number | null) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, [field]: v ?? 0 } : r)))

  const calc = useMemo(() => {
    const sumAtk = rows.reduce((a, r) => a + (r.atk || 0), 0)
    const sumDep = rows.reduce((a, r) => a + (r.dep || 0), 0)
    const sumHit = rows.reduce((a, r) => a + (r.hit || 0), 0)
    const atkCoef = 1 + sumAtk / 100   // 攻击系数（含 1 倍基础）
    const depCoef = 1 + sumDep / 100   // 加深系数（含 1 倍基础）
    const hitCoef = 1 + sumHit / 100
    const damage = (panel || 0) * atkCoef * depCoef * (floatV || 0) * (mult || 0)
    return { sumAtk, sumDep, sumHit, atkCoef, depCoef, hitCoef, damage }
  }, [rows, panel, floatV, mult])

  const numCol = (field: 'atk' | 'dep' | 'hit', title: string) => ({
    title,
    dataIndex: field,
    align: 'right' as const,
    width: 130,
    render: (_: number, r: Row) => (
      <InputNumber
        value={r[field]}
        onChange={(v) => setCell(r.key, field, v)}
        controls={false}
        addonAfter="%"
        style={{ width: 110 }}
      />
    ),
  })

  const totalRow: Row = {
    key: 'total', name: '合计 Σ', atk: calc.sumAtk, dep: calc.sumDep, hit: calc.sumHit,
  }

  return (
    <div>
      <Alert
        type="info"
        showIcon
        style={{ marginBottom: 14 }}
        message="填数自动计算（复刻《伤害计算第二版》）"
        description={
          <span>
            伤害 = <b>牧场面板</b> × <b>攻击系数</b> × <b>加深系数</b> × <b>浮动</b> × <b>倍率</b>；
            攻击/加深系数 = 1（基础）+ 各来源百分比之和。下表任意单元格可直接修改。
          </span>
        }
      />

      <Row gutter={[12, 12]} style={{ marginBottom: 14 }}>
        <Col xs={8} sm={6} md={5}>
          <Card size="small">
            <div style={{ fontSize: 12, color: '#999' }}>牧场面板攻击</div>
            <InputNumber value={panel} onChange={(v) => setPanel(v ?? 0)} controls={false} style={{ width: '100%' }} />
          </Card>
        </Col>
        <Col xs={8} sm={6} md={5}>
          <Card size="small">
            <div style={{ fontSize: 12, color: '#999' }}>浮动区间</div>
            <InputNumber value={floatV} onChange={(v) => setFloatV(v ?? 0)} step={0.1} controls={false} style={{ width: '100%' }} />
          </Card>
        </Col>
        <Col xs={8} sm={6} md={5}>
          <Card size="small">
            <div style={{ fontSize: 12, color: '#999' }}>技能/暴击倍率</div>
            <InputNumber value={mult} onChange={(v) => setMult(v ?? 0)} step={0.1} controls={false} style={{ width: '100%' }} />
          </Card>
        </Col>
      </Row>

      <Table<Row>
        size="small"
        pagination={false}
        rowKey="key"
        style={{ marginBottom: 14 }}
        scroll={{ x: 'max-content' }}
        columns={[
          { title: '来源', dataIndex: 'name', width: 90, fixed: 'left',
            render: (v: string, r: Row) => (r.key === 'total' ? <b>{v}</b> : v) },
          numCol('atk', '攻击 %'),
          numCol('dep', '加深 %'),
          numCol('hit', '命中 %'),
        ]}
        dataSource={rows}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row style={{ background: 'rgba(91,124,255,.08)' }}>
              <Table.Summary.Cell index={0}><b>合计 Σ</b></Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right"><b>{calc.sumAtk}%</b></Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="right"><b>{calc.sumDep}%</b></Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="right"><b>{calc.sumHit}%</b></Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />

      <Space style={{ marginBottom: 16 }} wrap>
        <Button onClick={() => setRows(DEFAULT_ROWS)}>填入示例</Button>
        <Button onClick={() => setRows(EMPTY_ROWS)}>清空</Button>
        <Tag color="blue">攻击系数 = 1 + {calc.sumAtk}% = {fmt(calc.atkCoef)}</Tag>
        <Tag color="purple">加深系数 = 1 + {calc.sumDep}% = {fmt(calc.depCoef)}</Tag>
        <Tag>命中系数 = {fmt(calc.hitCoef)}</Tag>
      </Space>

      <Card style={{ background: 'linear-gradient(120deg,#4b6cff,#7d5cff)', border: 'none' }}>
        <Row align="middle" gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,.85)' }}>伤害结果</span>}
              value={calc.damage}
              precision={2}
              valueStyle={{ color: '#fff', fontSize: 34, fontWeight: 700 }}
            />
          </Col>
          <Col xs={24} md={14}>
            <Paragraph style={{ color: 'rgba(255,255,255,.92)', margin: 0, fontFamily: 'monospace', fontSize: 13 }}>
              {fmt(panel)} × {fmt(calc.atkCoef)} × {fmt(calc.depCoef)} × {fmt(floatV)} × {fmt(mult)}
            </Paragraph>
          </Col>
        </Row>
      </Card>

      <Alert
        type="warning"
        showIcon
        style={{ marginTop: 14 }}
        message="提升技巧"
        description={
          <span>
            由不等式「a+b=k 时 a·b 在 a、b 越接近越大」——<Text strong>攻击系数与加深系数差距越小，伤害越高</Text>。
            当前攻击 {fmt(calc.atkCoef)} × 加深 {fmt(calc.depCoef)}，
            {calc.atkCoef > calc.depCoef ? '加深偏低，建议优先补加深（宝石/卡片/技能）。' :
              calc.atkCoef < calc.depCoef ? '攻击偏低，建议优先补攻击。' : '两项已均衡。'}
          </span>
        }
      />
    </div>
  )
}
