// 定时抓取逐光服论坛（Flarum）「zhuguang」标签下的帖子，写入 src/data/forum.json。
// 供活动页「最新论坛原文」与 AI 知识库使用。Node 18+（内置 fetch）。
// 手动运行：npm run sync ；定时由 .github/workflows/sync-forum.yml 触发。
import { writeFileSync, readFileSync, existsSync } from 'fs'

const BASE = process.env.FORUM_BASE || 'http://124.221.144.95:121'
const TAG = process.env.FORUM_TAG || 'zhuguang'
const OUT = new URL('../src/data/forum.json', import.meta.url)

const HTML_ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' }
function strip(h) {
  return (h || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z#0-9]+;/gi, (m) => HTML_ENT[m] || m)
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
async function getJSON(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(30000) })
  if (!r.ok) throw new Error(`${url} -> HTTP ${r.status}`)
  return r.json()
}

async function main() {
  const listUrl = `${BASE}/api/discussions?filter%5Btag%5D=${TAG}&sort=-createdAt&page%5Blimit%5D=50`
  const list = await getJSON(listUrl)
  const out = []
  for (const d of list.data || []) {
    const id = d.id
    const a = d.attributes || {}
    let text = ''
    try {
      const full = await getJSON(`${BASE}/api/discussions/${id}`)
      const posts = (full.included || [])
        .filter((x) => x.type === 'posts' && x.attributes && x.attributes.contentHtml)
        .sort((p, q) => (p.attributes.number || 0) - (q.attributes.number || 0))
      text = posts.map((p) => strip(p.attributes.contentHtml)).filter(Boolean).join('\n\n')
    } catch (e) {
      console.error('post fail', id, e.message)
    }
    out.push({ id, title: a.title || `#${id}`, date: (a.createdAt || '').slice(0, 10), text })
  }
  // 与现有内容比较，避免无变化也写入
  const json = JSON.stringify(out, null, 1)
  if (existsSync(OUT) && readFileSync(OUT, 'utf8') === json) {
    console.log('forum.json unchanged')
    return
  }
  writeFileSync(OUT, json)
  console.log(`forum.json updated: ${out.length} posts`)
}

main().catch((e) => { console.error('sync failed:', e.message); process.exit(0) /* 抓取失败不阻断流程 */ })
