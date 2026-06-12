import { Typography, Table, Alert, Tabs, Tag, Card, Input } from 'antd'
import { useMemo, useState } from 'react'
import { PageHeader } from '../components/common'
import { exp, nirvanaPets } from '../data'

const { Title, Paragraph } = Typography

const prices: [string, number, string][] = [
  ['滑板', 600, '个'], ['战标', 5, '个'], ['水晶卡（小）', 7, '组'], ['天仙', 2, '组'],
  ['仙侠', 500, '套'], ['仙卡', 200, '套'], ['通天龙令', 0.1, '组'], ['神秘情报', 0.5, '个'],
  ['册子', 0.8, '组'], ['厨女菇(2个8级红)', 80, '个'], ['涅卵', 2, '个'], ['大师球', 1, '个'],
  ['涅球', 0.5, '组'], ['天使之剑', 0.35, '组'], ['龙神/开涅礼包', 0.2, '组'], ['女神', 150, '套'],
  ['青龙妙丹', 2, '个'], ['破旧的传承珠', 30, '个'], ['朱雀妙丹', 3, '个'], ['雨露', 0.75, '组'],
  ['A丹', 0.1, '组'], ['B丹', 0.4, '组'], ['星牧', 2, '个'], ['华尔兹之舞', 10, '个'],
  ['紫龙之魂', 50, '个'], ['极寒之凝光', 50, '个'], ['盛世10件', 15, '套'], ['自然10件', 30, '套'],
  ['极品', 400, '对'], ['欧姆', 5, '本'],
]

const setRates = [
  ['盛世套装', 2.01, 3.31, 1.5], ['觉醒盛世', 2.57, 3.87, 1.91], ['圣诞婵娟', 3.63, 4.93, 2.18],
  ['自然套装', 3.32, 4.62, 2.25], ['女神套装', 3.88, 5.18, 2.86], ['仙侠套装', '617%', '373%', '390%'],
]
const cardRates = [
  ['黑白', 0.9, 0.35, 0.9], ['清明节气', 1.0, 0.45, 1.0], ['天魔', 1.6, 1.0, 1.6],
  ['女神', 3.0, 1.5, 3.0], ['仙侠套装', 4.0, 2.0, 4.0], ['新年牛卡', 4.5, 1.8, 4.2],
]

function ExpTable() {
  const [q, setQ] = useState('')
  const data = useMemo(() => {
    const n = parseInt(q, 10)
    return isNaN(n) ? exp : exp.filter((r) => r.lv === n || r.lv === n + 1 || r.lv === n - 1)
  }, [q])
  return (
    <>
      <Alert type="info" showIcon style={{ marginBottom: 10 }}
        message="「升级所需」为本级升下一级所需经验；「累计总经验」为从 1 级练到该级的总和。" />
      <Input.Search placeholder="输入等级快速定位…" allowClear style={{ maxWidth: 240, marginBottom: 10 }}
        onChange={(e) => setQ(e.target.value)} />
      <Table size="small" pagination={false} sticky scroll={{ y: 520 }} rowKey="lv"
        columns={[
          { title: '等级', dataIndex: 'lv', width: 80 },
          { title: '升级所需经验', dataIndex: 'need', align: 'right', render: (v: number) => v.toLocaleString() },
          { title: '累计总经验', dataIndex: 'total', align: 'right', render: (v: number) => v.toLocaleString() },
        ]}
        dataSource={data} />
    </>
  )
}

export default function DataTools() {
  return (
    <div>
      <PageHeader title="数值工具" sub="经验表 · 物价 · 伤害公式 · 涅槃加成名单" />
      <Tabs
        items={[
          {
            key: 'exp', label: '⏫ 等级经验表',
            children: <div id="exp"><ExpTable /></div>,
          },
          {
            key: 'price', label: '💰 物价参考',
            children: (
              <div id="price">
                <Alert type="warning" showIcon style={{ marginBottom: 10 }}
                  message="玩家整理的指导价，仅供参考，以实际市场为准。" />
                <Table size="small" pagination={false} scroll={{ y: 480 }} rowKey="key"
                  columns={[
                    { title: '物品', dataIndex: 0 },
                    { title: '参考价', dataIndex: 1, align: 'right' },
                    { title: '单位', dataIndex: 2, width: 80 },
                  ]}
                  dataSource={prices.map((p, i) => ({ ...p, key: i }))} />
              </div>
            ),
          },
          {
            key: 'dmg', label: '⚔️ 伤害计算',
            children: (
              <div id="dmg">
                <Card size="small" style={{ marginBottom: 14 }}>
                  <Paragraph code style={{ whiteSpace: 'normal' }}>
                    伤害 = 牧场面板 × 攻击系数(装备+宝石+卡片+称号+1倍初始) × 加深系数(1+装备+宝石+卡片+技能+称号) × 浮动 × 暴击倍率
                  </Paragraph>
                  <Paragraph style={{ marginBottom: 0 }}>
                    <b>提升技巧：</b>由不等式「a+b=k 时 a·b 在 a、b 越接近时越大」——<b>攻击与加深两项数值差距越小，伤害提升越大</b>。例如攻击×加深为 11.72×8.15 时，仍应优先补加深（5×5 &gt; 4×6）。
                  </Paragraph>
                </Card>
                <Title level={5}>套装基础倍率参考</Title>
                <Table size="small" pagination={false} style={{ maxWidth: 520, marginBottom: 16 }} rowKey="key"
                  columns={[{ title: '套装', dataIndex: 0 }, { title: '攻击', dataIndex: 1, align: 'right' },
                    { title: '加深', dataIndex: 2, align: 'right' }, { title: '命中', dataIndex: 3, align: 'right' }]}
                  dataSource={setRates.map((r, i) => ({ ...r, key: i }))} />
                <Title level={5}>卡片倍率参考</Title>
                <Table size="small" pagination={false} style={{ maxWidth: 520 }} rowKey="key"
                  columns={[{ title: '卡片', dataIndex: 0 }, { title: '攻击', dataIndex: 1, align: 'right' },
                    { title: '加深', dataIndex: 2, align: 'right' }, { title: '命中', dataIndex: 3, align: 'right' }]}
                  dataSource={cardRates.map((r, i) => ({ ...r, key: i }))} />
              </div>
            ),
          },
          {
            key: 'nirvana', label: `❄️ 涅槃加成名单 (${nirvanaPets.length})`,
            children: (
              <div id="nirvana">
                <Alert type="info" showIcon style={{ marginBottom: 10 }}
                  message="以下宠物作涅槃副宠时带有加成。" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {nirvanaPets.map((n) => <Tag key={n} style={{ margin: 0 }}>{n}</Tag>)}
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
