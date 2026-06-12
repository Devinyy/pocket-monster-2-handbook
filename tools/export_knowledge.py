#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成「AI 可读知识库」语料，供后续接入 AI 问答 / 向量检索(RAG)。
输出到 knowledge/：
  - 多个 Markdown 文档（人 + AI 都可读）
  - chunks.jsonl：分块文档，每行一个 {id,title,category,source,text}，便于 embedding 检索
数据来源：src/data/*.json（由 export_data.py 生成）+ 本文件内嵌的公式/攻略文本。
重新运行：python3 tools/export_knowledge.py
"""
import os, re, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'src', 'data')
KB = os.path.join(ROOT, 'knowledge')
os.makedirs(KB, exist_ok=True)

def load(name):
    with open(os.path.join(SRC, name), encoding='utf-8') as f:
        return json.load(f)

CHUNKS = []
def chunk(cid, title, category, text, source):
    CHUNKS.append({'id': cid, 'title': title, 'category': category,
                   'source': source, 'text': text.strip()})

def write_md(name, text):
    with open(os.path.join(KB, name), 'w', encoding='utf-8') as f:
        f.write(text.strip() + '\n')
    print('wrote knowledge/' + name)

SRC_NAMES = {
    'guide': '新手简单指导（神宠篇）.doc',
    'formula': '口袋合宠&涅槃公式.docx / 神宠涅槃&合成攻略.docx',
    'pets': '口袋百科重制版·宠物篇.pdf',
    'newpets': '遗迹口袋百科之新宠.doc',
    'tasks': '口袋精灵全专属任务图鉴.pdf',
    'boss': 'BOSS图鉴.pdf',
    'equip': '逐光服装备图鉴.pptx / 装备+公式.xlsx',
    'exp': '等级所需经验.txt',
    'price': '物价参考.xlsx',
    'dmg': '伤害计算第二版.xls',
    'heshen': '合神材料.xls',
    'nirvana': '涅槃加成宠物.txt',
}

# ---------------- 0. 新手入门 ----------------
GUIDE_MD = """# 新手入门（神宠篇）

> 游戏：《口袋怪兽2 / 口袋精灵2》。本文为新手养成总指南。

## 关于神宠
- 神宠技能分层次，系数 150~400（目前最高）。系数 = 同样属性能打出的伤害百分比，如 150=150%。
- 新手礼包神宠约 150/180/220 系数（非 R 使用）。
- 神宠 150CC 以后可用「格斗宝宝」涅槃（约 10YB 一个，可代购）。

## 充值比例
- 新号充值：1:30 YB；元宝卡充值：1:100 YB。
- 500 档开包最高 1:70 YB；5000 档开包最高 1:87 YB。
- 买材料/装备/神卵可向老玩家收购，通常比开包便宜。

## 交易
- 新手交易建议找群主或管理员担保，游戏可自由交易，存在骗子，务必谨慎。

## 合成（五系龙 / 小神龙琅琊）
- 材料：进化之书、超级进化书、强化丹 B、天神之石、月饼。
- 等级：合成需主副宠 40 级以上。40 级=200W 月饼×3；45 级=200W×6；41 级=200W×1+500W×1。
- 合成必须添加护宠仙石/守宠魂石/天神之石，否则合宠失败宠物消失。
- 五系宠合成前最多进化 10 次；8/9/10 阶可用强化丹 A/B 进化提升成长(cc)，不改外观。

### 五系进化链
- 木：绿波姆→波碧姆→碧蟾→老爷蛙→紫冥蟾→青龙兽(青龙珠+45级)→青蛟→小青龙琅琅→青龙琅琅
- 水：水波姆→波波姆→水仙→冰露→爱莉丝(妖精之泪)→艾薇儿→冰龙苍海
- 金：金波姆→波光姆→黄金鸟→圣羽天马→金龙霸王/黄金鸟教皇/恶魔波姆/圣羽天马
- 紫冥蟾做主宠与非波姆宠合成有概率得青龙兽；圣羽天马/黄金鸟教皇/恶魔波姆合成有概率出金龙霸王。

### 五系龙循环路线
青龙琅琅→炎龙血焰→黄龙莫虚→金龙霸王→冰龙苍海→循环。

### 小神龙琅琊（满神 60cc）合成
- 主宠：五系龙(56.9cc 以上)×1；副宠：五系龙×1(属性须不同)；材料：至尊神石×1、★★★成长魂石×1；主副宠 40 级以上。

## 涅槃
- 神系属性优于五系，除进化(最高10次)外只能用涅槃提升属性与成长。
- 材料：主宠×1、副宠×1(60cc小神龙/格斗宝宝/自然·暗夜女神等)、涅槃兽×1(亥-冰滩捕捉; 午/卯-元宝礼包)、涅槃丹(加成高/成功率低)或涅槃神丹(加成低/百分百成功)、各类捏成丹×1。
- 等级：主副神宠 60 级以上，越高越好；涅槃兽 60 级即可。
- 修炼仙册需求：60级=1, 80级=8, 90级=20, 100级=60, 110级=164, 120级=460, 130级=800。
- 涅槃必须加涅槃丹/神丹，否则失败将失去涅槃兽。
- 速涅(连涅)：涅槃兽达60级后用神丹涅槃，每涅一次主宠用天仙玉露进化10次，增长cc快但属性掉得快，后期需用涅槃兽「午」回属性。

## 大陆副本（难度由上往下递增）
- 伊苏王的神墓(30级, §伊苏的梦魇§)
- 火龙王的宫殿(50级, §赤色神龙§)
- 史芬克斯密穴(70级, §九尾天狐§)
- 玲珑城(85级, §雪羽凤凰§)
- 厄菲斯深渊(90级, §受诅咒的寒江雪§)
- 阿尔提密林(1级, 暗灵江雪)；菲拉苛地域(1级, 菲拉苛—暗灵江雪)

## 装备/卡片分档
- 装备：非R→龙魂/通天/阿瑞斯之手等通天塔散装；小R→厄菲斯套/阿尔提套/情殇改·恋套；R→盛世/自然/女神/封神/三国套。
- 卡片：非R→副本掉落感恩卡(限时1小时)；小R→VIP钻石卡/尊容卡/黑白卡套；R→展翼/天魔/刀剑/鸡卡卡套(卡片不可交易)。

## 开包
- 开包看脸，老玩家没货再开。首推自然礼包(神宠概率大、属性中等)；土豪可试猴年/金鸡/凯蒂/逍遥/封神系列礼包。
"""

# ---------------- 1. 合成涅槃公式 ----------------
FORMULA_MD = """# 合成 · 涅槃公式

> ZZ = 至尊神石。整理自《口袋合宠&涅槃公式》《神宠涅槃&合成攻略》。

## 合成公式

### 五系龙 / 神宠 合成（核心）
- 五系龙 + 10阶宠物 + 至尊神石 = 小神龙琅琊
- 兽王神 + 10阶宠物 + 至尊神石 = 白虎
- 天界玉兔 + 鬼屋宠物 + 至尊神石 = 海马
- 海马 + 鬼屋宠物/金鱼 + 至尊神石 = 小玄武
- 小玄武 + 10阶宠物 + 至尊神石 = ★龙蛇玄武★
- 地狱火魔兽 + 腐尸鸟 + 至尊神石 = 深渊魔童

### 五系终极媒介宠
- 木★艾比 + 青龙琅琅 + 至尊神石 = ★艾比★
- 金★阿莲娜 + 金龙霸王 + 至尊神石 = ★阿莲娜★
- 火★西西 + 炎龙血焰 + 至尊神石 = ★西西★
- 土★巴特 + 黄龙莫虚 + 至尊神石 = ★巴特★
- 水★佑碧 + 冰龙沧海 + 至尊神石 = ★佑碧★

### 五系终极神宠
- 青龙琅琅 + 木★艾比 + 至尊神石 = 狻猊
- 金龙霸王 + 金★阿莲娜 + 至尊神石 = 许德拉
- 冰龙苍海 + 水★佑碧 + 至尊神石 = 齐伦
- 炎龙血焰 + 火★西西 + 至尊神石 = 艾尔斯
- 黄龙莫虚 + 土★巴特 + 至尊神石 = 剑蛇君

### 神宠合成（主 80cc+ / 副 50cc+）
- 兽王 + 女法师琳达 + 至尊神石 = 蝶影娅瑟
- 鬼精灵欧姆 + 福尔摩狮 + 至尊神石 = 蝶影娅瑟
- 小玄武 + 偷桃的小猴 + 至尊神石 = 蝶影娅瑟
- 小玄武 + 女法师琳达 + 至尊神石 = 尤佳娜
- 兽王 + 福尔摩狮 + 至尊神石 = 尤佳娜
- 鬼精灵欧姆 + 偷桃的小猴 + 至尊神石 = 尤佳娜
- 青龙琅琅 + 青龙琅琅 + 至尊神石 = 木★艾比

### 圣殿神宠合成（主 80cc+ / 副 60cc+）
- K歌仙人掌 + 僵尸叔叔 + 至尊神石 = GM-鸭子
- K歌仙人掌 + 正太木乃伊 + 至尊神石 = 忍者小乌龟
- 暗夜咻豹 + 女法师琳达 + 至尊神石 = 囧娃娃
- 悟不空 + 魔法女生 + 至尊神石 = GM-鸭子
- 石阵巨人 + 暗夜咻豹 + 至尊神石 = GM-鸭子
- 石阵巨人 + K歌仙人掌 + 至尊神石 = 蜡笔MM
- 暗夜咻豹 + 僵尸叔叔 + 至尊神石 = 四叶草宝宝

### 新大陆 BOSS 合成（加至尊神石必出）
- 鸭子/小狸猫/飞天猪 + 岩兽人/雪蝶兽/火焰蝙蝠 + 至尊神石 = 石阵巨人
- 怒鹰/单车狮子王/无辜小鹿 + 中山狼/猞猁猫/化蛇王 + 至尊神石 = K歌仙人掌
- 毒喃鼠/鸭嘴龟/慕斯 + 花叶童子/紫貘/火羽 + 至尊神石 = 暗夜咻豹
- 福尔摩狮/女法师琳达/偷桃的小猴 + 火焰蝙蝠/火羽/岩兽人 + 至尊神石 = 悟不空

## 涅槃公式（常用）
- 小神龙 + 小神龙 = ★青龙★
- ★青龙★ + 影兽 = 清影龙
- 白虎 + 小神龙 = ★破天虎★
- ★破天虎★ + 虎妞 = ★圣破天★
- ★龙蛇玄武★ + 五系终极媒介宠 = ★穷奇★
- 剑蛇君 + 五系终极媒介宠/终极神宠 = 暗翼君主·初级

## 幼年★马鲁斯 成长记
- 合成：幼年★马鲁斯+天界玉兔(≥1cc)=普通★马鲁斯；普通★马鲁斯(30cc)+天界玉兔(40cc)=成年★马鲁斯；成年★马鲁斯+空星小肥龙(60+60)=双星马
- 涅槃：双星马+信安吉=空星马；空星马+影兽/召唤之龙=超马

## 玄冰仙使 合成链
- 天界玉兔+鬼屋宠物+至尊神石=海马 → 海马+鬼屋宠物/金鱼+至尊神石=小玄武 → 小玄武+10阶宠物+至尊神石=★龙蛇玄武★
- 500cc★龙蛇玄武★+华尔兹=真·华尔兹 → ≮寒江雪≯(扫雷获得)+真·华尔兹=真·☆寒江雪☆ → 真·☆寒江雪☆+极寒仙侍=玄冰仙使
- 华尔兹宝宝由「华尔兹之舞」兑换任务进化；玄冰仙使专属任务需要【极寒之凝光】。

## 波姆进化到极致
- 金波姆→生羽天马；水波姆→冰露；火波姆→血炎兽；土波姆→蚂蚁守卫。（只用超进和进化之书）

## 合神材料（+10cc 增长，册子BMW合神+吃天仙估算）
| 合法 | 200w | 册 | 进书 | 超进 | A | B | 妖泪 | 天神 | 三星 | 至尊 | 绑至尊 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 四爱 | 12 | 16 | 12 | 55 | 6 | 10 | 4 | 6 | 17 | 1 | 0 |
| 册子BMW | 0 | 27 | 18 | 5 | 6 | 2 | 1 | 18 | 33 | 1 | 0 |
| 低册BMW | 63 | 8 | 20 | 26 | 18 | 11 | 1 | 8 | 23 | 2 | 0 |
| 四爱绑 | 18 | 14 | 10 | 54 | 0 | 3 | 5 | 0 | 10 | 0 | 10 |
| BMW绑 | 1 | 22 | 20 | 10 | 6 | 4 | 1 | 9 | 34 | 0 | 1 |

缩写：200w=200W月饼，册=修炼仙册，进书=进化之书，超进=超级进化书，A/B=强化丹，妖泪=妖精之泪，天神=天神之石，三星=★★★成长魂石，至尊=至尊神石。
"""

def build_guide_formula():
    write_md('01-新手入门.md', GUIDE_MD)
    write_md('02-合成涅槃公式.md', FORMULA_MD)
    # chunk guide by ## sections
    for i, sec in enumerate(re.split(r'\n## ', GUIDE_MD)):
        sec = sec.strip()
        if not sec:
            continue
        title = sec.splitlines()[0].lstrip('# ').strip()
        chunk(f'guide-{i}', f'新手入门 · {title}', '新手入门', '## ' + sec if i else sec, SRC_NAMES['guide'])
    for i, sec in enumerate(re.split(r'\n## ', FORMULA_MD)):
        sec = sec.strip()
        if not sec:
            continue
        title = sec.splitlines()[0].lstrip('# ').strip()
        chunk(f'formula-{i}', f'合成涅槃 · {title}', '合成涅槃', '## ' + sec if i else sec, SRC_NAMES['formula'])

# ---------------- 2. 宠物图鉴 ----------------
def build_pets():
    data = load('petsAtlas.json')
    lines = ['# 宠物图鉴（系列与名录）', '', '> 来源：口袋百科重制版·宠物篇。详细技能见图鉴页码。', '']
    for s in data:
        names = '、'.join(p['name'] for p in s['pets'])
        pages = ', '.join(str(p['page']) for p in s['pages'])
        lines += [f'## {s["series"]}', f'- 宠物：{names}', f'- 图鉴页码：{pages}', '']
        chunk(f'pets-{s["series"]}', f'宠物图鉴 · {s["series"]}', '宠物图鉴',
              f'{s["series"]}系列宠物：{names}。', SRC_NAMES['pets'])
    write_md('03-宠物图鉴.md', '\n'.join(lines))

# ---------------- 3. 新宠技能 ----------------
def build_newpets():
    data = load('newpets.json')
    lines = ['# 新宠技能库', '', '> 来源：遗迹口袋百科·新宠。技能括号内为满级数值。', '']
    for sec in data:
        lines.append(f'## {sec["title"]}')
        for c in sec['cards']:
            lines.append(f'### {c["name"]}')
            for sk in c['skills']:
                lines.append(f'- **{sk["name"]}**：{sk["desc"]}' if sk['desc'] else f'- **{sk["name"]}**')
            for o in c['obtain']:
                lines.append(f'- {o}')
            lines.append('')
            txt = f'{c["name"]}（{sec["title"]}）技能：' + '；'.join(
                (sk['name'] + ('：' + sk['desc'] if sk['desc'] else '')) for sk in c['skills'])
            if c['obtain']:
                txt += '。' + ' '.join(c['obtain'])
            chunk(f'newpet-{c["name"]}', f'新宠 · {c["name"]}', '新宠技能', txt, SRC_NAMES['newpets'])
    write_md('04-新宠技能.md', '\n'.join(lines))

# ---------------- 4. 专属任务 ----------------
def build_tasks():
    data = load('tasksAtlas.json')
    lines = ['# 专属任务图鉴（名录）', '', '> 来源：口袋精灵全专属任务图鉴。完整步骤见对应页码图。', '']
    for t in data['index']:
        lines.append(f'- {t["name"]}（第 {t["page"]} 页）')
    names = '、'.join(t['name'] for t in data['index'])
    chunk('tasks-index', '专属任务名录', '专属任务',
          f'拥有专属任务的宠物：{names}。', SRC_NAMES['tasks'])
    write_md('05-专属任务.md', '\n'.join(lines))

# ---------------- 5. BOSS ----------------
def build_boss():
    data = load('boss.json')
    lines = ['# BOSS 图鉴（血量）', '', '> 来源：BOSS图鉴。HP 数值。', '']
    for region in data:
        lines.append(f'## {region["region"]}')
        lines.append('| 地点 | BOSS | 普通 | 困难 | 冒险 |')
        lines.append('|---|---|---|---|---|')
        parts = []
        for r in region['rows']:
            normal = r['normal'] or r['single'] or '—'
            lines.append(f'| {r["place"]} | {r["boss"].strip("§")} | {normal} | {r["hard"] or "—"} | {r["adv"] or "—"} |')
            parts.append(f'{r["place"]}的{r["boss"].strip("§")} HP 普通{normal}/困难{r["hard"] or "—"}/冒险{r["adv"] or "—"}')
        lines.append('')
        chunk(f'boss-{region["region"]}', f'BOSS · {region["region"]}', 'BOSS',
              f'{region["region"]} BOSS 血量：' + '；'.join(parts), SRC_NAMES['boss'])
    write_md('06-BOSS图鉴.md', '\n'.join(lines))

# ---------------- 6. 装备卡片 ----------------
EQUIP_MD = """# 装备 · 卡片

> 套装图鉴来源：逐光服装备图鉴.pptx；搭配数值来源：装备+公式.xlsx。

## 装备搭配参考
| 搭配 | 攻击/命中/其他 | 吸血/抵消 |
|---|---|---|
| 情人改+黑魔凯+龙魂+TT | 140攻/104命中 | 30吸血/25抵消 |
| 情人恋+黑魔凯+龙魂+TT | 151攻/111命中 | 42吸血/35抵消 |
| EFS+龙魂+TT | 145攻/80命中/20生命 | 30吸血/33抵消 |
| EFS神+龙魂+TT | 180攻/109命中/25生命 | 40吸血/40抵消 |
| 神恩+黑魔凯+龙魂+TT | 185攻/104命中 | 40吸血/35抵消 |
| 玲珑+黑魔凯+龙魂+TT | 140攻/104命中 | 吸血30/抵消 |
| 黑魔5+TT+EFS神戒+SS项链手镯翅膀 | 189攻/84命中/30加深/38防御 | 30吸血/30抵消 |
| 黑魔4+TT+龙魂+EFS神戒+SS饰品 | 220攻/109命中/30加深/78防御 | 30吸血 |
| SS8+龙魂+TT | 280攻/103命中/60加深/60防御 | — |
| SS8+日耀头环+神圣夜魅戒 | 245攻/38命中/50加深/105防御 | 55吸血/45抵消 |
| 黑魔武器衣鞋+天使翅膀头镯戒指+龙魂+TT+SS项链 | 265攻/104命中/25加深/25生命/88防御 | — |

## 套装/卡套清单（逐光服装备图鉴）
仙侠套装、女神套装、圣婵十件套、自然套装、觉醒ss10件套、SS10件套、EFS10件套、厄菲斯神套10件、玲珑套装、阿尔提套装、情改9件套、幽蜚R-01专属四件、神恩套装、TT散件、黑魔套、重影三件套、沉睡首饰套、国王套装、皇后套装、熔岩套装、诅咒神器套装、游梦套装、婵娟神器套装、08北京奥运套、神圣战场套装、桀骜套装(家族商店)、群雄套装(家族商店)、仙侠卡套、女神卡套、马鲁斯卡套、天魔卡套、黑白卡套、新年牛卡。
"""

def build_equip():
    write_md('07-装备卡片.md', EQUIP_MD)
    for i, sec in enumerate(re.split(r'\n## ', EQUIP_MD)):
        sec = sec.strip()
        if not sec:
            continue
        title = sec.splitlines()[0].lstrip('# ').strip()
        chunk(f'equip-{i}', f'装备卡片 · {title}', '装备卡片', '## ' + sec if i else sec, SRC_NAMES['equip'])

# ---------------- 7. 数值（经验/物价/伤害/涅槃名单） ----------------
PRICES = [
    ('滑板',600,'个'),('战标',5,'个'),('水晶卡（小）',7,'组'),('天仙',2,'组'),('仙侠',500,'套'),('仙卡',200,'套'),
    ('通天龙令',0.1,'组'),('神秘情报',0.5,'个'),('册子',0.8,'组'),('厨女菇(2个8级红)',80,'个'),('涅卵',2,'个'),
    ('大师球',1,'个'),('涅球',0.5,'组'),('天使之剑',0.35,'组'),('龙神/开涅礼包',0.2,'组'),('女神',150,'套'),
    ('青龙妙丹',2,'个'),('破旧的传承珠',30,'个'),('朱雀妙丹',3,'个'),('雨露',0.75,'组'),('A丹',0.1,'组'),('B丹',0.4,'组'),
    ('星牧',2,'个'),('华尔兹之舞',10,'个'),('紫龙之魂',50,'个'),('极寒之凝光',50,'个'),('盛世10件',15,'套'),
    ('自然10件',30,'套'),('极品',400,'对'),('欧姆',5,'本'),
]

def build_data():
    exp = load('exp.json')
    nirvana = load('nirvanaPets.json')
    lines = ['# 数值：经验 · 物价 · 伤害 · 涅槃加成', '']
    # 经验表（采样关键等级，全表见 exp.json）
    lines.append('## 等级经验表（关键等级，完整见 src/data/exp.json）')
    lines.append('| 等级 | 升级所需经验 | 累计总经验 |')
    lines.append('|---|---|---|')
    key_lv = {1,10,20,30,40,50,60,70,80,90,100,110,120,130}
    for r in exp:
        if r['lv'] in key_lv:
            lines.append(f'| {r["lv"]} | {r["need"]:,} | {r["total"]:,} |')
    lines.append('')
    chunk('exp-table', '等级经验表', '数值',
          '；'.join(f'{r["lv"]}级累计{r["total"]:,}' for r in exp if r['lv'] in key_lv), SRC_NAMES['exp'])
    # 物价
    lines.append('## 物价参考（玩家指导价，仅供参考）')
    lines.append('| 物品 | 参考价 | 单位 |')
    lines.append('|---|---|---|')
    for n, p, u in PRICES:
        lines.append(f'| {n} | {p} | {u} |')
    lines.append('')
    chunk('price-table', '物价参考', '数值',
          '物价：' + '；'.join(f'{n} {p}/{u}' for n, p, u in PRICES), SRC_NAMES['price'])
    # 伤害
    dmg = (
        '## 伤害计算\n'
        '公式：伤害 = 牧场面板 × 攻击系数(装备+宝石+卡片+称号+1倍初始) × 加深系数(1+装备+宝石+卡片+技能+称号) × 浮动 × 暴击倍率。\n'
        '提升技巧：由 a+b=k 时 a·b 在 a、b 越接近越大 —— 攻击与加深两项差距越小伤害提升越大；'
        '攻击×加深为 11.72×8.15 时仍应优先补加深(5×5>4×6)。\n\n'
        '套装基础倍率(攻击/加深/命中)：盛世2.01/3.31/1.5；觉醒盛世2.57/3.87/1.91；圣诞婵娟3.63/4.93/2.18；'
        '自然3.32/4.62/2.25；女神3.88/5.18/2.86；仙侠617%/373%/390%。\n'
        '卡片倍率(攻击/加深/命中)：黑白0.9/0.35/0.9；清明节气1.0/0.45/1.0；天魔1.6/1.0/1.6；'
        '女神3.0/1.5/3.0；仙侠4.0/2.0/4.0；新年牛卡4.5/1.8/4.2。\n'
    )
    lines.append(dmg)
    chunk('dmg-formula', '伤害计算公式与套装/卡片倍率', '数值', dmg, SRC_NAMES['dmg'])
    # 涅槃加成名单
    lines.append('## 涅槃加成宠物名单（作涅槃副宠带加成）')
    lines.append('、'.join(nirvana))
    lines.append('')
    chunk('nirvana-list', '涅槃加成宠物名单', '数值',
          '涅槃加成宠物：' + '、'.join(nirvana), SRC_NAMES['nirvana'])
    write_md('08-数值-经验物价伤害.md', '\n'.join(lines))

# ---------------- 索引 + chunks ----------------
def build_index():
    readme = """# 口袋怪兽2 知识库（AI 可读）

本目录为《口袋怪兽2 / 口袋精灵2》攻略资料的结构化语料，供 AI 问答 / 向量检索(RAG)使用。

## 文件
- `01-新手入门.md` —— 充值/交易/合成/涅槃/副本/开包
- `02-合成涅槃公式.md` —— 全套合成与涅槃公式、专题养成链、合神材料
- `03-宠物图鉴.md` —— 各系列宠物名录与图鉴页码
- `04-新宠技能.md` —— 超神宠/卡片宠的技能与获取方式
- `05-专属任务.md` —— 拥有专属任务的宠物名录
- `06-BOSS图鉴.md` —— 三大区域 BOSS 血量
- `07-装备卡片.md` —— 装备搭配数值与套装/卡套清单
- `08-数值-经验物价伤害.md` —— 经验表/物价/伤害公式/涅槃加成名单
- `chunks.jsonl` —— 上述内容的分块文档，每行一个 JSON：`{id,title,category,source,text}`，可直接做 embedding 入库

## 使用建议
- 检索/RAG：对 `chunks.jsonl` 的 `text` 字段做向量化，命中后可用 `title`/`category`/`source` 给出引用。
- 结构化查询（公式/数值/列表）：直接读 `../src/data/*.json`（程序友好）。
- 数据来源均为玩家社区资料，可能随游戏版本变化，回答时建议注明“仅供参考”。
"""
    write_md('README.md', readme)
    with open(os.path.join(KB, 'chunks.jsonl'), 'w', encoding='utf-8') as f:
        for c in CHUNKS:
            f.write(json.dumps(c, ensure_ascii=False) + '\n')
    print(f'wrote knowledge/chunks.jsonl - {len(CHUNKS)} chunks')

if __name__ == '__main__':
    build_guide_formula()
    build_pets()
    build_newpets()
    build_tasks()
    build_boss()
    build_equip()
    build_data()
    build_index()
    print('Knowledge base ready.')
