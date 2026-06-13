import { Typography, Table, Alert, Image } from 'antd'
import { PageHeader, NamePills } from '../components/common'
import { LazyImage } from '../components/LazyImage'
import { equipment, imgUrl } from '../data'

const { Title } = Typography

const combos = [
  ['情人改 + 黑魔凯 + 龙魂 + TT', '140 攻 / 104 命中', '30 吸血 / 25 抵消'],
  ['情人恋 + 黑魔凯 + 龙魂 + TT', '151 攻 / 111 命中', '42 吸血 / 35 抵消'],
  ['EFS + 龙魂 + TT', '145 攻 / 80 命中 / 20 生命', '30 吸血 / 33 抵消'],
  ['EFS神 + 龙魂 + TT', '180 攻 / 109 命中 / 25 生命', '40 吸血 / 40 抵消'],
  ['神恩 + 黑魔凯 + 龙魂 + TT', '185 攻 / 104 命中', '40 吸血 / 35 抵消'],
  ['玲珑 + 黑魔凯 + 龙魂 + TT', '140 攻 / 104 命中', '吸血 30 / 抵消'],
  ['黑魔5 + TT + EFS神戒 + SS项链手镯翅膀', '189 攻 / 84 命中 / 30 加深 / 38 防御', '30 吸血 / 30 抵消'],
  ['黑魔4 + TT + 龙魂 + EFS神戒 + SS饰品', '220 攻 / 109 命中 / 30 加深 / 78 防御', '30 吸血'],
  ['SS8 + 龙魂 + TT', '280 攻 / 103 命中 / 60 加深 / 60 防御', '—'],
  ['SS8 + 日耀头环 + 神圣夜魅戒', '245 攻 / 38 命中 / 50 加深 / 105 防御', '55 吸血 / 45 抵消'],
  ['黑魔武器衣鞋 + 天使翅膀头镯戒指 + 龙魂 + TT + SS项链', '265 攻 / 104 命中 / 25 加深 / 25 生命 / 88 防御', '—'],
]

export default function Equipment() {
  return (
    <div>
      <PageHeader title="装备 · 卡片图鉴" sub="逐光服全套装 / 卡套与搭配参考（创作：小尤 · 补充：南风）" />
      <Alert type="info" showIcon style={{ marginBottom: 14 }}
        message="具体属性数值见图鉴截图，点击可放大查看。" />

      <Title level={3}>装备搭配参考</Title>
      <Table size="small" pagination={false} scroll={{ x: 'max-content' }} rowKey="key"
        columns={[
          { title: '搭配', dataIndex: 0 },
          { title: '攻击 / 命中 / 其他', dataIndex: 1 },
          { title: '吸血 / 抵消', dataIndex: 2 },
        ]}
        dataSource={combos.map((c, i) => ({ ...c, key: i }))} />

      <Title level={3} style={{ marginTop: 24 }}>套装 · 卡套图鉴</Title>
      <div style={{ marginBottom: 12 }}>
        <NamePills items={equipment.filter((e) => e.isHead).map((e) => ({ id: `eq${e.page}`, label: e.title }))} />
      </div>
      <Image.PreviewGroup>
        <div className="atlas-grid">
          {equipment.map((e) => (
            <div className="atlas-card" key={e.page} id={`eq${e.page}`}>
              <LazyImage src={imgUrl('equip', e.img)} alt={e.title} imgStyle={{ display: 'block', width: '100%' }} minHeight={200} />
              <div className="cap">{e.title}</div>
            </div>
          ))}
        </div>
      </Image.PreviewGroup>
    </div>
  )
}
