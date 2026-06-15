import { Typography, Card, Table, Alert, Tag, Row, Col } from 'antd'
import { PageHeader, FormulaList, Gallery } from '../components/common'
import {
  synthesisGroups, nirvanaGroup, marusChain, xuanbingChain,
  bomuExtreme, heshenMaterials,
} from '../data/formulas'
import { serverFormulaGroups } from '../data/serverFormulas'
import { galleries } from '../data'

const { Title, Paragraph } = Typography

export default function Synthesis() {
  return (
    <div>
      <PageHeader title="合成 · 涅槃" sub="全套合成与涅槃公式、养成专题链（ZZ = 至尊神石）" />
      <Alert type="info" showIcon style={{ marginBottom: 18 }}
        message="顶部搜索可直接定位某只宠物的合成方式。" />

      <Title level={3} id="syn">合成公式</Title>
      <Row gutter={[16, 16]}>
        {synthesisGroups.map((g) => (
          <Col xs={24} md={12} key={g.title}>
            <Card size="small" style={{ height: '100%' }}
              title={<span>{g.title} {g.note && <Tag color="blue">{g.note}</Tag>}</span>}>
              <FormulaList rows={g.rows} />
            </Card>
          </Col>
        ))}
      </Row>

      <Title level={3} id="nir" style={{ marginTop: 26 }}>涅槃公式</Title>
      <Card size="small" title={nirvanaGroup.title}>
        <FormulaList rows={nirvanaGroup.rows} />
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12} id="marus">
          <Card size="small" title="🐴 幼年★马鲁斯 成长记" style={{ height: '100%' }}>
            <Paragraph strong style={{ marginBottom: 4 }}>合成</Paragraph>
            <FormulaList rows={marusChain.synth} />
            <Paragraph strong style={{ margin: '8px 0 4px' }}>涅槃</Paragraph>
            <FormulaList rows={marusChain.nirvana} />
          </Card>
        </Col>
        <Col xs={24} md={12} id="xuanbing">
          <Card size="small" title="❄️ 玄冰仙使 合成链" style={{ height: '100%' }}>
            <FormulaList rows={xuanbingChain} />
            <Alert type="info" style={{ marginTop: 8 }}
              message="华尔兹宝宝由「华尔兹之舞」兑换任务进化；玄冰仙使专属任务需要【极寒之凝光】。" />
          </Card>
        </Col>
      </Row>

      <Title level={3} id="server" style={{ marginTop: 26 }}>逐光服进阶公式</Title>
      <Alert type="info" showIcon style={{ marginBottom: 14 }}
        message="整理自官方论坛《宠物获得方式》等帖。「任意宠」=任意副宠；「A / B」=有几率得到其一。" />
      <Row gutter={[16, 16]}>
        {serverFormulaGroups.map((g) => (
          <Col xs={24} md={12} key={g.title}>
            <Card size="small" style={{ height: '100%' }}
              title={<span>{g.title} {g.note && <Tag color="purple">{g.note}</Tag>}</span>}>
              <FormulaList rows={g.rows} />
            </Card>
          </Col>
        ))}
      </Row>

      <Title level={3} id="heshen" style={{ marginTop: 26 }}>合神材料参考</Title>
      <Paragraph type="secondary">按 +10cc 增长、册子 BMW 合神 + 吃天仙估算的常见方案所需材料（来自「合神材料」表）。</Paragraph>
      <Table size="small" pagination={false} scroll={{ x: 'max-content' }} rowKey="key"
        columns={heshenMaterials.head.map((h, i) => ({
          title: h, dataIndex: i, key: i, align: i === 0 ? 'left' : 'right' as const,
        }))}
        dataSource={heshenMaterials.rows.map((r, i) => ({ ...r, key: i }))} />
      <Alert type="info" showIcon style={{ marginTop: 8 }}
        message="缩写：200w=200W月饼，册=修炼仙册，进书=进化之书，超进=超级进化书，A/B=强化丹，妖泪=妖精之泪，天神=天神之石，三星=★★★成长魂石，至尊=至尊神石。" />

      <Title level={3} id="bomu" style={{ marginTop: 26 }}>波姆进化 · 合神教程</Title>
      <Title level={5}>波姆进化到极致</Title>
      <Table size="small" pagination={false} style={{ maxWidth: 360 }} rowKey="bomu"
        columns={[{ title: '波姆', dataIndex: 'bomu' }, { title: '极致形态', dataIndex: 'form' }]}
        dataSource={bomuExtreme.map((x, i) => ({ ...x, key: i }))} />
      <Alert type="info" style={{ margin: '8px 0' }} message="「进化到极致」指波姆只用超进和进化之书进化。" />
      {galleries.bomu.length > 0 && (
        <Gallery folder="bomu" items={galleries.bomu.map((f) => ({ img: f }))} />
      )}

      <Title level={5} style={{ marginTop: 16 }}>手把手合 60CC 小神龙琅琊（图文）</Title>
      <Paragraph>准备 2 只绿波姆 + 至尊、二青龙珠、若干进化书/超进、若干 AB 丹。核心：主宠绿波姆吃满 B 丹做主，循环合成累积成长，到目标成长（约 57cc+ ＋ 10cc+）合出 60CC 小神龙琅琊。</Paragraph>
      {galleries.heshen.length > 0 && (
        <Gallery folder="heshen" items={galleries.heshen.map((f) => ({ img: f }))} />
      )}
    </div>
  )
}
