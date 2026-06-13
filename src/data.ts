// 统一数据入口：导入 src/data/*.json（由 `npm run data` 从 web-data 生成），
// 并构建全站搜索索引。
import expJson from './data/exp.json'
import nirvanaJson from './data/nirvanaPets.json'
import bossJson from './data/boss.json'
import petsDetailJson from './data/petsDetail.json'
import tasksAtlasJson from './data/tasksAtlas.json'
import equipmentJson from './data/equipment.json'
import newpetsJson from './data/newpets.json'
import galleriesJson from './data/galleries.json'
import { oldMaps, newMaps, dungeons, materials } from './data/maps'

export interface ExpRow { lv: number; need: number; total: number }
export interface BossRow { place: string; boss: string; normal: string; hard: string; adv: string; single: string }
export interface BossRegion { region: string; rows: BossRow[] }
export interface AtlasPage { page: number; img: string }
export interface PetDetail { name: string; skills: Skill[]; obtain: string[]; sprite: string }
export interface PetDetailSeries { series: string; pets: PetDetail[] }
export interface TasksAtlas { index: { name: string; page: number }[]; pages: AtlasPage[] }
export interface EquipSlide { page: number; img: string; title: string; isHead: boolean }
export interface Skill { name: string; desc: string }
export interface NewPetCard { name: string; skills: Skill[]; obtain: string[] }
export interface NewPetSection { title: string; cards: NewPetCard[] }
export interface Galleries { bomu: string[]; heshen: string[]; boss: string[] }

export const exp = expJson as ExpRow[]
export const nirvanaPets = nirvanaJson as string[]
export const boss = bossJson as BossRegion[]
export const petsDetail = petsDetailJson as PetDetailSeries[]
export const tasksAtlas = tasksAtlasJson as TasksAtlas
export const equipment = equipmentJson as EquipSlide[]
export const newpets = newpetsJson as NewPetSection[]
export const galleries = galleriesJson as Galleries

export function imgUrl(folder: string, file: string): string {
  return `${import.meta.env.BASE_URL}img/${folder}/${file}`
}

// ---------------- 全站搜索索引 ----------------
export interface SearchItem { name: string; path: string; cat: string; kw?: string }

function buildIndex(): SearchItem[] {
  const items: SearchItem[] = []
  petsDetail.forEach((s, i) =>
    s.pets.forEach((p) =>
      items.push({ name: p.name, path: `/pets#ps${i}`, cat: '宠物图鉴', kw: s.series })))
  newpets.forEach((s, i) =>
    s.cards.forEach((c) =>
      items.push({ name: c.name, path: `/newpets#ns${i}`, cat: '新宠技能', kw: s.title })))
  tasksAtlas.index.forEach((t) =>
    items.push({ name: t.name, path: `/tasks#tp${t.page}`, cat: '专属任务' }))
  boss.forEach((r) =>
    r.rows.forEach((b) =>
      b.boss && items.push({ name: b.boss.replace(/[§★]/g, ''), path: '/boss', cat: 'BOSS', kw: b.place })))
  equipment.forEach((e) =>
    e.isHead && items.push({ name: e.title, path: `/equipment#eq${e.page}`, cat: '装备/卡片' }))
  nirvanaPets.forEach((n) =>
    items.push({ name: n, path: '/data#nirvana', cat: '涅槃加成' }))
  // 地图：地图名 + 怪物 + 掉落关键词
  ;[...oldMaps, ...newMaps].forEach((m) => {
    const kw = [...m.monsters, ...m.drops, ...m.boss].join(' ')
    items.push({ name: m.name, path: '/maps', cat: '地图', kw })
  })
  dungeons.forEach((d) =>
    items.push({ name: d.name, path: '/maps', cat: '副本', kw: d.boss.join(' ') }))
  materials.forEach((mt) =>
    items.push({ name: mt.name, path: '/maps', cat: '材料', kw: mt.where }))
  // 静态页锚点
  const statics: SearchItem[] = [
    { name: '充值比例', path: '/guide#chongzhi', cat: '新手入门' },
    { name: '关于交易', path: '/guide#jiaoyi', cat: '新手入门' },
    { name: '合成攻略', path: '/guide#hecheng', cat: '新手入门' },
    { name: '涅槃攻略', path: '/guide#nirvana', cat: '新手入门' },
    { name: '大陆副本', path: '/guide#tips', cat: '新手入门' },
    { name: '开包概率', path: '/guide#tips', cat: '新手入门' },
    { name: '玄冰仙使', path: '/synthesis#xuanbing', cat: '合成/涅槃', kw: '寒江雪 华尔兹' },
    { name: '马鲁斯', path: '/synthesis#marus', cat: '合成/涅槃', kw: '双星马 超马' },
    { name: '波姆进化', path: '/synthesis#bomu', cat: '合成/涅槃' },
    { name: '合神材料', path: '/synthesis#heshen', cat: '合成/涅槃' },
    { name: '等级经验表', path: '/data#exp', cat: '数值工具' },
    { name: '物价参考', path: '/data#price', cat: '数值工具' },
    { name: '伤害计算', path: '/data#dmg', cat: '数值工具', kw: '公式 加深 攻击' },
  ]
  return items.concat(statics)
}

export const searchIndex = buildIndex()

// ---------------- 宠物名 → 图鉴位置（用于合成公式 chip 跳转） ----------------
const normName = (s: string) => s.replace(/[★☆≮≯·（）()\s]/g, '').replace(/\d+cc.*$/i, '')
const petLinkMap: Record<string, string> = {}
petsDetail.forEach((s, i) => {
  const path = `/pets#ps${i}`
  s.pets.forEach((p) => {
    petLinkMap[normName(p.name)] = path
    const after = p.name.includes('：') ? p.name.split('：').pop()! : p.name
    const k = normName(after)
    if (k.length >= 2 && !petLinkMap[k]) petLinkMap[k] = path
  })
})
// 返回该名称对应的宠物图鉴锚点，无匹配则 null
export function petLink(name: string): string | null {
  const k = normName(name.replace(/\(.*?\)|（.*?）/g, ''))
  if (k.length < 2) return null
  return petLinkMap[k] || null
}
