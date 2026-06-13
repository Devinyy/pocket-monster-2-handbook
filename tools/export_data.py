#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把 web-data/ 下从原始资料(docs/ziliao)提取的文本，解析为 React 应用使用的 JSON，
输出到 src/data/。同时清点 public/img 下各图集页码。重新运行 `npm run data` 即可重建。
"""
import os, re, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'web-data')
OUT  = os.path.join(ROOT, 'src', 'data')
IMG  = os.path.join(ROOT, 'public', 'img')
os.makedirs(OUT, exist_ok=True)

def read(n):
    with open(os.path.join(DATA, n), encoding='utf-8') as f:
        return f.read()

def dump(name, obj):
    with open(os.path.join(OUT, name), 'w', encoding='utf-8') as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
    print('wrote', name, '-', (len(obj) if hasattr(obj, '__len__') else ''))

def imgs_in(folder):
    d = os.path.join(IMG, folder)
    if not os.path.isdir(d):
        return []
    fs = [x for x in os.listdir(d) if x.lower().endswith(('.jpg', '.jpeg', '.png', '.gif'))]
    def key(s):
        m = re.findall(r'\d+', s)
        return (int(m[-1]) if m else 0, s)
    return sorted(fs, key=key)

def page_num(fname):
    m = re.findall(r'\d+', fname)
    return int(m[-1]) if m else 0

# ---------------- 经验表 ----------------
def exp_table():
    rows = []
    for ln in read('exp.txt').splitlines()[1:]:
        p = ln.split('\t')
        if len(p) >= 3 and p[0].strip().isdigit():
            rows.append({'lv': int(p[0]), 'need': int(p[1]) if p[1].strip() else 0,
                         'total': int(p[2]) if p[2].strip() else 0})
    dump('exp.json', rows)

# ---------------- 涅槃加成名单 ----------------
def nirvana_pets():
    s = read('nirvana_pets.txt').replace('\n', '').strip()
    tags = [t.strip() for t in s.split(',') if t.strip()]
    dump('nirvanaPets.json', tags)

# ---------------- BOSS ----------------
def boss():
    txt = read('boss.txt')
    parts = re.split(r'【(.+?)】', txt)
    out = []
    for i in range(1, len(parts), 2):
        name = parts[i].strip()
        content = parts[i + 1]
        rows = []
        cur = None
        for ln in content.splitlines():
            s = ln.strip()
            if not s:
                continue
            m = re.match(r'^\d+[、.]\s*(.+)', s)
            if m:
                rest = m.group(1)
                hpm = re.search(r'HP[：:]\s*([\d,]+)', rest)
                pbpart = re.split(r'HP[：:]', rest)[0]
                pb = re.split(r'[—–-]{1,2}', pbpart)
                place = pb[0].strip()
                bs = pb[1].strip() if len(pb) > 1 else ''
                cur = {'place': place, 'boss': bs, 'normal': '', 'hard': '', 'adv': '',
                       'single': hpm.group(1) if hpm else ''}
                rows.append(cur)
                continue
            dm = re.match(r'(普通|困难|冒险)\s*(?:无\s*boss|无)?\s*(.*?)\s*HP[：:]\s*([\d,]+)', s)
            if dm and cur is not None:
                lvl, extra, hp = dm.group(1), dm.group(2).strip(), dm.group(3)
                key = {'普通': 'normal', '困难': 'hard', '冒险': 'adv'}[lvl]
                cur[key] = hp
                if extra and not cur['boss']:
                    cur['boss'] = extra
                cur['single'] = ''
                continue
            lm = re.search(r'(.+?)HP[：:]\s*([\d,]+)', s)
            if lm and cur is not None:
                nm = lm.group(1).strip()
                if nm:
                    rows.append({'place': cur['place'], 'boss': nm, 'normal': '', 'hard': '',
                                 'adv': '', 'single': lm.group(2)})
        out.append({'region': name, 'rows': rows})
    dump('boss.json', out)

# ---------------- 宠物图鉴目录 ----------------
def pets_atlas():
    txt = read('pets.txt')
    lines = txt.splitlines()
    toc_re = re.compile(r'^(.*?)[：:]?\.{3,}\s*(\d+)\s*$')
    series = []
    cur = None
    for ln in lines[1:]:
        s = ln.strip()
        if not s:
            continue
        m = toc_re.match(s)
        if not m:
            break
        name = m.group(1).strip()
        pg = int(m.group(2))
        is_series = (name.endswith('宠') or name.endswith('系列宠')
                     or ('系列' in name and '：' not in name))
        if is_series:
            cur = {'series': name.rstrip('：:'), 'pets': []}
            series.append(cur)
        else:
            if cur is None:
                cur = {'series': '其他', 'pets': []}
                series.append(cur)
            cur['pets'].append({'name': name, 'page': pg})
    pages = {page_num(f): f for f in imgs_in('pets')}
    for sec in series:
        seen = []
        for p in sec['pets']:
            if p['page'] not in seen:
                seen.append(p['page'])
        sec['pages'] = [{'page': pg, 'img': pages.get(pg, '')} for pg in seen if pages.get(pg)]
    series = [s for s in series if s['pets']]
    dump('petsAtlas.json', series)

# ---------------- 专属任务目录 ----------------
def tasks_atlas():
    txt = read('tasks.txt')
    toc_re = re.compile(r'^(.*?)[：:]?\.{3,}\s*(\d+)\s*$')
    entries = []
    for ln in txt.splitlines():
        m = toc_re.match(ln.strip())
        if m:
            nm, pg = m.group(1).strip(), int(m.group(2))
            if nm:
                entries.append({'name': nm, 'page': pg})
    pages = {page_num(f): f for f in imgs_in('tasks')}
    used = []
    for e in entries:
        if e['page'] not in used:
            used.append(e['page'])
    if not used:
        used = sorted(pages.keys())
    page_list = [{'page': pg, 'img': pages[pg]} for pg in sorted(set(used)) if pg in pages]
    dump('tasksAtlas.json', {'index': entries, 'pages': page_list})

# ---------------- 装备/卡片 ----------------
def equipment():
    titles = {}
    for ln in read('equip_titles.txt').splitlines():
        if '\t' in ln:
            n, t = ln.split('\t', 1)
            titles[int(n)] = t.strip().rstrip('：:')
    slides = imgs_in('equip')
    out = []
    cur_title = ''
    for f in slides:
        n = page_num(f)
        anchor = False
        if titles.get(n):
            cur_title = titles[n]
            anchor = True
        out.append({'page': n, 'img': f,
                    'title': cur_title if n != 1 else '封面',
                    'isHead': anchor and n != 1})
    dump('equipment.json', out)

# ---------------- 新宠技能 ----------------
def newpets():
    raw_lines = [l.strip() for l in read('newpets.txt').splitlines()]
    section_re = re.compile(r'^[一-龥·★≮≯☆\d]+(套装宠|系列宠|套装系列宠|卡片套装宠|阶宠|纪念宠|有加成的宠|改变为280的宠)[：:]?\s*$')
    skill_re = re.compile(r'^(.+?LV\.\d[^:：]*)[:：](.*)$')
    obtain_kw = ('获得方式', '获取方式', '涅槃公式', '涅盘公式', '兑换为', '新增永久涅盘公式',
                 '专属奖励', '完成专属', '可通过', 'Ps', 'PS')

    # 预先记下每个非空行的下一非空行索引
    n = len(raw_lines)
    next_nonempty = [None] * n
    nxt = None
    for i in range(n - 1, -1, -1):
        next_nonempty[i] = nxt
        if raw_lines[i]:
            nxt = i

    def is_name_line(i):
        s = raw_lines[i]
        if not s or 'LV.' in s or '技能' in s:
            return False
        if section_re.match(s):
            return False
        if any(s.startswith(k) for k in obtain_kw):
            return False
        j = next_nonempty[i]
        return j is not None and raw_lines[j].startswith('技能')

    sections = [{'title': '超神宠', 'cards': []}]
    cur = sections[0]
    card = None
    def flush():
        nonlocal card
        if card and (card['skills'] or card['obtain']):
            cur['cards'].append(card)
        card = None

    for i in range(n):
        s = raw_lines[i]
        if not s:
            continue
        if section_re.match(s) and 'LV.' not in s:
            flush()
            cur = {'title': s.rstrip('：: '), 'cards': []}
            sections.append(cur)
            continue
        if s.startswith('技能'):
            continue
        if is_name_line(i):
            flush()
            card = {'name': s.rstrip('：: '), 'skills': [], 'obtain': []}
            continue
        sm = skill_re.match(s)
        if sm and card is not None:
            card['skills'].append({'name': sm.group(1).strip(), 'desc': sm.group(2).strip()})
            continue
        if 'LV.' in s and card is not None:
            card['skills'].append({'name': s, 'desc': ''})
            continue
        if card is not None and any(k in s for k in obtain_kw):
            txt = s.strip()
            if txt and txt not in ('专属奖励：', '专属奖励:'):
                card['obtain'].append(txt)
            continue
    flush()
    sections = [s for s in sections if s['cards']]
    dump('newpets.json', sections)

# ---------------- 简单图集（波姆/合神） ----------------
def simple_galleries():
    dump('galleries.json', {
        'bomu': imgs_in('bomu'),
        'heshen': imgs_in('heshen'),
        'boss': imgs_in('boss'),
    })

if __name__ == '__main__':
    exp_table()
    nirvana_pets()
    boss()
    # 宠物图鉴改为「一宠一卡」，由 tools/build_pets_detail.py 生成 petsDetail.json
    tasks_atlas()
    equipment()
    newpets()
    simple_galleries()
    print('All data exported to src/data/')
