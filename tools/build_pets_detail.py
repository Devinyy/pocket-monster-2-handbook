#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把《口袋百科重制版·宠物篇》PDF 解析为「一宠一卡」结构化数据：
  - 文字（宠物名 / 系列 / 技能）由正文解析，前端自行渲染（不用截图）
  - 立绘：从 PDF 抽出每只宠物独立的 RGBA 透明立绘，按 PDF 分页与正文逐只配对
输出：
  - src/data/petsDetail.json   [{series, pets:[{name, skills:[{name,desc}], obtain:[], sprite}]}]
  - public/img/petsprite/p{page}_{idx}.png  合成后的透明立绘
依赖：pdftotext / pdfimages(poppler) + Pillow
重新运行：python3 tools/build_pets_detail.py
"""
import os, re, subprocess, json, glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(ROOT, 'docs', 'ziliao', '口袋百科重制版宠物篇(1).pdf')
PAGED = os.path.join(ROOT, 'web-data', 'pets_paged.txt')
SPRITE_DIR = os.path.join(ROOT, 'public', 'img', 'petsprite')
OUT = os.path.join(ROOT, 'src', 'data', 'petsDetail.json')

SECTION_RE = re.compile(r'^[一-龥·★≮≯☆\d]+(圣装宠|套装宠|系列宠|套装系列宠|卡片套装宠|阶宠|纪念宠|神宠|媒介宠|终极神宠)[：:]\s*$')
# 技能切分：只在「句末标点」之后、且后面紧跟「名字+LV.数字」处断开（后顾断言避免把技能名截断）
SKILL_SPLIT = re.compile(r'(?<=[。！）)])(?=[一-龥A-Za-z·\[\]]{2,14}\s*LV\.\d)')
SKILL_PARSE = re.compile(r'^(.+?LV\.\d[^：:]*)[：:](.*)$', re.S)
NEXT_OK = re.compile(r'^(技能|.*LV\.\d|合成公式|获取方式|获得方式|涅槃公式|涅盘公式)')
NAME_BAD = ('技能', '公式', '获取', '获得', '涅', '进化', '可由', 'HP', '伤害', '攻击', '目录', 'LV',
            '）', ')', '效果', '秒', '分钟', '冷却', '回复', '条件', '学习', '附加', '属性', '％', '%')

# ---------------- 1. 合成透明立绘 ----------------
def build_sprites():
    # 清理旧的原始抽取文件
    for f in glob.glob(os.path.join(SPRITE_DIR, 's-*.png')):
        os.remove(f)
    for f in glob.glob(os.path.join(SPRITE_DIR, 'p*_*.png')):
        os.remove(f)
    os.makedirs(SPRITE_DIR, exist_ok=True)
    # 原始抽取（image + smask 各一文件，顺序与 -list 一致）
    subprocess.run(['pdfimages', '-png', PDF, os.path.join(SPRITE_DIR, 's')], check=True)
    listing = subprocess.run(['pdfimages', '-list', PDF], capture_output=True, text=True).stdout
    rows = []
    for ln in listing.splitlines()[2:]:
        parts = ln.split()
        if len(parts) < 4:
            continue
        rows.append({'page': int(parts[0]), 'type': parts[2]})
    # 配对：image 行 + 紧随其后的 smask 行
    page_sprites = {}   # page -> [filename, ...] (按页内顺序)
    i = 0
    while i < len(rows):
        if rows[i]['type'] == 'image':
            page = rows[i]['page']
            img_f = os.path.join(SPRITE_DIR, f's-{i:03d}.png')
            mask_f = None
            if i + 1 < len(rows) and rows[i + 1]['type'] == 'smask':
                mask_f = os.path.join(SPRITE_DIR, f's-{i + 1:03d}.png')
            idx = len(page_sprites.get(page, []))
            out_name = f'p{page}_{idx}.png'
            out_path = os.path.join(SPRITE_DIR, out_name)
            if os.path.exists(img_f):
                im = Image.open(img_f).convert('RGB')
                if mask_f and os.path.exists(mask_f):
                    m = Image.open(mask_f).convert('L').resize(im.size)
                    im = im.convert('RGBA')
                    im.putalpha(m)
                im.save(out_path)
                page_sprites.setdefault(page, []).append(out_name)
        i += 1
    # 删除原始 s-*.png
    for f in glob.glob(os.path.join(SPRITE_DIR, 's-*.png')):
        os.remove(f)
    print('sprites merged. pages with sprites:', len(page_sprites))
    return page_sprites

# ---------------- 2. 解析正文（分页） ----------------
def clean_desc(s):
    s = s.strip()
    s = re.sub(r'\s+', '', s)            # 去掉换行造成的空格（CJK）
    s = s.replace('LV.', ' LV.').replace('  ', ' ')
    return s.strip()

def parse_text(page_sprites):
    pages = open(PAGED, encoding='utf-8').read().split('\f')
    # 收集所有行 + 其页码 + 行内序
    flat = []   # (page, text)
    for pi, pg in enumerate(pages, 1):
        for ln in pg.splitlines():
            flat.append((pi, ln.strip()))
    n = len(flat)
    # 下一非空行索引
    nxt = [None] * n
    j = None
    for i in range(n - 1, -1, -1):
        nxt[i] = j
        if flat[i][1]:
            j = i

    def is_name(i):
        s = flat[i][1]
        if not s or len(s) > 16:
            return False
        if any(b in s for b in NAME_BAD):
            return False
        if SECTION_RE.match(s):
            return False
        if re.match(r'^.+\.{3,}\s*\d+$', s):   # 目录行
            return False
        if any(p in s for p in '，。！'):
            return False
        k = nxt[i]
        return k is not None and bool(NEXT_OK.match(flat[k][1]))

    # 标记 name / section 位置
    marks = []   # (i, kind, text, page)
    for i in range(n):
        s = flat[i][1]
        if not s:
            continue
        if SECTION_RE.match(s):
            marks.append((i, 'section', s.rstrip('：: '), flat[i][0]))
        elif is_name(i):
            marks.append((i, 'name', s, flat[i][0]))

    series = []
    cur = None
    name_marks = [m for m in marks if m[1] == 'name']
    # 为每个 name 计算技能文本范围：到下一个 name 或 section 的 i
    stops = sorted(m[0] for m in marks)
    def next_stop(after):
        for s in stops:
            if s > after:
                return s
        return n

    # 页内宠物计数器，用于配立绘
    page_counter = {}

    mi = 0
    for (i, kind, text, page) in marks:
        if kind == 'section':
            cur = {'series': text, 'pets': []}
            series.append(cur)
            continue
        if cur is None:
            cur = {'series': '其他', 'pets': []}
            series.append(cur)
        # 源文档末段大量神宠无章节标题，全在「五系终极神宠」之后；把非「X系：」的拆到「其他神宠」
        if cur['series'] == '五系终极神宠' and not re.match(r'^[金木水火土]系[：:]', text):
            forked = next((s for s in series if s['series'] == '其他神宠（圣殿 · 专属）'), None)
            if forked is None:
                forked = {'series': '其他神宠（圣殿 · 专属）', 'pets': []}
                series.append(forked)
            cur = forked
        # 技能文本：名字行之后到下一个 stop；若紧跟一行「技能：」则跳过它
        start = nxt[i]
        if start is not None and flat[start][1].startswith('技能') and len(flat[start][1]) <= 4:
            start = nxt[start]
        end = next_stop(i)
        body = []
        if start is not None:
            for t in range(start, end):
                txt = flat[t][1]
                if txt and not (txt.startswith('技能') and len(txt) <= 4):
                    body.append(txt)
        joined = ''.join(body)
        # 拆技能
        skills = []
        obtain = []
        for chunk in SKILL_SPLIT.split(joined):
            chunk = chunk.strip()
            if not chunk:
                continue
            m = SKILL_PARSE.match(chunk)
            if m:
                skills.append({'name': clean_desc(m.group(1)), 'desc': clean_desc(m.group(2))})
            elif any(k in chunk for k in ('获得', '获取', '进化', '可由', '兑换', '涅槃', '涅盘', '合成公式', '神秘商店')):
                obtain.append(clean_desc(chunk))
        # 配立绘：该宠物名所在页的第 idx 张
        idx = page_counter.get(page, 0)
        page_counter[page] = idx + 1
        sprites = page_sprites.get(page, [])
        sprite = sprites[idx] if idx < len(sprites) else ''
        cur['pets'].append({'name': text, 'skills': skills, 'obtain': obtain, 'sprite': sprite})

    series = [s for s in series if s['pets']]
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(series, f, ensure_ascii=False, indent=1)
    total = sum(len(s['pets']) for s in series)
    withimg = sum(1 for s in series for p in s['pets'] if p['sprite'])
    print(f'parsed {len(series)} series, {total} pets, {withimg} with sprite -> {OUT}')

if __name__ == '__main__':
    ps = build_sprites()
    parse_text(ps)
