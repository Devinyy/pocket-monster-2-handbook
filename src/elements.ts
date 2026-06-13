// 五系 / 属性 配色与系列配色工具
export interface Elem { key: string; label: string; antd: string; hex: string }

// 五系（用于筛选 chip）
export const ELEMENTS: Elem[] = [
  { key: '金', label: '金', antd: 'gold', hex: '#e8b339' },
  { key: '木', label: '木', antd: 'green', hex: '#52c41a' },
  { key: '水', label: '水', antd: 'blue', hex: '#4096ff' },
  { key: '火', label: '火', antd: 'volcano', hex: '#fa541c' },
  { key: '土', label: '土', antd: 'orange', hex: '#d48806' },
]

// 扩展属性色（怪物/BOSS 可能含神/暗/光）
export const ELEM_HEX: Record<string, string> = {
  金: '#e8b339', 木: '#52c41a', 水: '#4096ff', 火: '#fa541c', 土: '#d48806',
  神: '#9254de', 暗: '#c41d7f', 光: '#13c2c2',
}
export const ELEM_ANTD: Record<string, string> = {
  金: 'gold', 木: 'green', 水: 'blue', 火: 'volcano', 土: 'orange',
  神: 'purple', 暗: 'magenta', 光: 'cyan',
}

// 从 "鸭子（水）" 中识别属性
export function detectElement(s: string): string | null {
  const m = s.match(/[（(]\s*([金木水火土神暗光])/)
  return m ? m[1] : null
}

// 系列稳定配色（按系列序号取色，用于宠物卡顶部色条）
const SERIES_PALETTE = [
  '#5b7cff', '#9254de', '#fa8c16', '#13c2c2', '#52c41a', '#eb2f96',
  '#faad14', '#2f54eb', '#fa541c', '#1677ff', '#722ed1', '#08979c',
  '#d4380d', '#c41d7f', '#389e0d', '#7cb305',
]
export function seriesColor(i: number): string {
  return SERIES_PALETTE[i % SERIES_PALETTE.length]
}
