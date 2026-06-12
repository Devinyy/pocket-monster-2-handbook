import { Typography, Alert, Table, Card, Tag, Divider } from 'antd'
import { PageHeader } from '../components/common'
import { evolveChains } from '../data/formulas'

const { Title, Paragraph } = Typography

const simpleCols = (cols: { t: string; k: string }[]) =>
  cols.map((c) => ({ title: c.t, dataIndex: c.k, key: c.k }))

export default function Guide() {
  return (
    <div>
      <PageHeader title="新手入门" sub="从 0 到神宠的完整养成路线（整理自《新手简单指导·神宠篇》）" />
      <Alert type="warning" showIcon style={{ marginBottom: 18 }}
        message="部分数值随版本可能变动，仅供参考。" />

      <Title level={3} id="shenchong">关于神宠</Title>
      <Card size="small">
        <Paragraph>神宠技能分层次，系数为 <b>150 ~ 400</b>（目前最高）。系数即同样属性能打出的伤害百分比，如 150 = 150%（新手礼包神宠约 150/180/220，非 R 使用）。</Paragraph>
        <Paragraph style={{ marginBottom: 0 }}>神宠 150CC 以后可用 <b>格斗宝宝</b> 涅槃（约 10YB 一个，可代购）。</Paragraph>
      </Card>

      <Title level={3} id="chongzhi" style={{ marginTop: 24 }}>充值比例</Title>
      <Table size="small" pagination={false} rowKey="m"
        columns={simpleCols([{ t: '方式', k: 'm' }, { t: '比例', k: 'r' }, { t: '备注', k: 'n' }])}
        dataSource={[
          { m: '新号充值', r: '1 : 30 YB', n: '—' },
          { m: '元宝卡充值', r: '1 : 100 YB', n: '—' },
          { m: '500 档开包', r: '最高 1 : 70 YB', n: '喜欢开包推荐' },
          { m: '5000 档开包', r: '最高 1 : 87 YB', n: '—' },
        ].map((x, i) => ({ ...x, key: i }))} />

      <Title level={3} id="jiaoyi" style={{ marginTop: 24 }}>关于交易</Title>
      <Alert type="info" showIcon message="新手交易建议找群主或管理员担保；本游戏可自由交易，存在部分骗子，务必谨慎。" />

      <Title level={3} id="hecheng" style={{ marginTop: 24 }}>关于合成（五系龙 / 小神龙琅琊）</Title>
      <Card size="small">
        <Paragraph><b>材料：</b>进化之书、超级进化书、强化丹 B、天神之石、月饼若干（可向老玩家索要）。</Paragraph>
        <Paragraph><b>等级与月饼：</b>合成需主副宠 40 级以上。40 级 = 200W 月饼 ×3；45 级 = 200W ×6；41 级 = 200W ×1 + 500W ×1。</Paragraph>
        <Paragraph style={{ marginBottom: 0 }}><b>注意：</b>合成必须添加护宠仙石 / 守宠魂石 / 天神之石，否则<b>合宠失败宠物将消失</b>。五系宠合成前最多进化 10 次。</Paragraph>
      </Card>

      <Title level={4} style={{ marginTop: 18 }}>五系进化链</Title>
      {evolveChains.map((c) => (
        <Card size="small" key={c.el} style={{ marginBottom: 8 }}>
          <Tag color="blue">{c.el}系</Tag> {c.chain}
        </Card>
      ))}
      <Alert type="info" showIcon style={{ marginTop: 8 }}
        message="紫冥蟾做主宠与非波姆宠合成有概率得青龙兽；圣羽天马/黄金鸟教皇/恶魔波姆合成有概率出金龙霸王，否则进入三宠循环。" />

      <Title level={4} style={{ marginTop: 18 }}>五系龙循环路线</Title>
      <Card size="small">
        {['青龙琅琅', '炎龙血焰', '黄龙莫虚', '金龙霸王', '冰龙苍海'].map((x, i) => (
          <span key={x}>{i > 0 && <span className="op"> → </span>}<span className="chip">{x}</span></span>
        ))}
        <span className="op"> → 循环</span>
      </Card>

      <Title level={4} style={{ marginTop: 18 }}>小神龙琅琊（满神 60cc）合成</Title>
      <Card size="small">
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>主宠：五系龙（56.9cc 以上）×1；副宠：五系龙 ×1（属性须与主宠不同）。</li>
          <li>材料：至尊神石 ×1、★★★成长魂石 ×1；主副宠 40 级以上。</li>
          <li>至尊神石非 R 难获取，可向老玩家索要/购买；R 玩家由神秘商店礼包开出。</li>
        </ul>
      </Card>

      <Title level={3} id="nirvana" style={{ marginTop: 24 }}>关于涅槃</Title>
      <Card size="small">
        <Paragraph>神系属性优于五系，除进化(最高 10 次)外只能用<b>涅槃</b>提升属性与成长。</Paragraph>
        <Paragraph><b>材料：</b>主宠 ×1、副宠 ×1（60cc 小神龙 / 格斗宝宝 / 自然·暗夜女神等）、涅槃兽 ×1（亥-冰滩捕捉；午/卯-元宝礼包）、涅槃丹（加成高/成功率低）或涅槃神丹（加成低/百分百成功）、各类捏成丹 ×1。</Paragraph>
        <Paragraph style={{ marginBottom: 8 }}><b>等级：</b>主副神宠 60 级以上，等级越高越好；涅槃兽 60 级即可。</Paragraph>
        <Table size="small" pagination={false} rowKey="lv"
          columns={simpleCols([{ t: '等级', k: 'lv' }, { t: '修炼仙册', k: 'c' }])}
          dataSource={[[60, 1], [80, 8], [90, 20], [100, 60], [110, 164], [120, 460], [130, 800]]
            .map(([lv, c]) => ({ lv, c, key: lv }))} />
      </Card>
      <Alert type="warning" showIcon style={{ marginTop: 8 }}
        message="涅槃必须添加涅槃丹/神丹，否则涅槃失败将失去涅槃兽。涅前请先看涅槃公式，确认宠物可涅。" />
      <Paragraph type="secondary" style={{ marginTop: 8 }}>
        <b>速涅（连涅）：</b>主副宠涅槃兽达 60 级后用神丹涅槃，每涅一次主宠用天仙玉露进化 10 次。增长 cc 快但属性掉得快，后期需用涅槃兽「午」回属性。
      </Paragraph>

      <Divider />
      <Title level={3} id="tips">游戏小贴士</Title>

      <Title level={5}>宠物装备（按投入分档）</Title>
      <ul>
        <li><b>非 R：</b>龙魂、通天、阿瑞斯之手等通天塔散装。</li>
        <li><b>小 R：</b>厄菲斯套、阿尔提套、情殇改/恋套。</li>
        <li><b>R：</b>盛世套、自然套、女神套、封神套、三国套。</li>
      </ul>
      <Title level={5}>卡片装备</Title>
      <ul>
        <li><b>非 R：</b>副本掉落感恩卡（限时 1 小时）。</li>
        <li><b>小 R：</b>水晶商店 VIP 钻石卡、尊容卡、黑白卡套。</li>
        <li><b>R：</b>展翼卡套、天魔卡套、刀剑卡套、鸡卡卡套（卡片不可交易）。</li>
      </ul>
      <Title level={5}>大陆副本（难度由上往下递增）</Title>
      <Table size="small" pagination={false} rowKey="d"
        columns={simpleCols([{ t: '副本', k: 'd' }, { t: '等级', k: 'lv' }, { t: 'BOSS', k: 'b' }])}
        dataSource={[
          { d: '伊苏王的神墓', lv: 30, b: '§伊苏的梦魇§' },
          { d: '火龙王的宫殿', lv: 50, b: '§赤色神龙§' },
          { d: '史芬克斯密穴', lv: 70, b: '§九尾天狐§' },
          { d: '玲珑城', lv: 85, b: '§雪羽凤凰§' },
          { d: '厄菲斯深渊', lv: 90, b: '§受诅咒的寒江雪§' },
          { d: '阿尔提密林', lv: 1, b: '暗灵江雪' },
          { d: '菲拉苛地域', lv: 1, b: '菲拉苛—暗灵江雪' },
        ].map((x, i) => ({ ...x, key: i }))} />
      <Title level={5} style={{ marginTop: 12 }}>开包概率</Title>
      <Paragraph>开包看脸，老玩家没货再考虑开包。首推<b>自然礼包</b>（神宠概率大、属性中等）；土豪可试猴年/金鸡/凯蒂/逍遥/封神系列礼包，有几率获得高系数宠。</Paragraph>
    </div>
  )
}
