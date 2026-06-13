// Cloudflare Worker：静态资源托管 + AI 助手后端（/api/chat）
// - 用知识库(knowledge.json)做轻量关键词 RAG 检索
// - 代理 DeepSeek Chat Completions，流式(SSE)返回
// 需要在 Cloudflare 配置密钥：DEEPSEEK_API_KEY（必填）
// 可选环境变量：DEEPSEEK_MODEL（默认 deepseek-v4pro）、DEEPSEEK_BASE_URL（默认 https://api.deepseek.com）
import knowledge from '../src/data/knowledge.json'

interface Chunk { t: string; c: string; x: string }
const KB = knowledge as Chunk[]

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> }
  DEEPSEEK_API_KEY?: string
  DEEPSEEK_MODEL?: string
  DEEPSEEK_BASE_URL?: string
}

// 把查询拆成中文单字/二元词 + 英文数字词
function terms(q: string): string[] {
  const out = new Set<string>()
  const clean = q.toLowerCase().replace(/[^一-龥a-z0-9]+/g, ' ')
  for (const w of clean.split(/\s+/).filter(Boolean)) {
    if (/^[a-z0-9]+$/.test(w)) { out.add(w); continue }
    for (let i = 0; i < w.length; i++) {
      out.add(w[i])
      if (i + 1 < w.length) out.add(w.slice(i, i + 2))
    }
  }
  return [...out]
}

function retrieve(query: string, k = 6): Chunk[] {
  const ts = terms(query)
  if (!ts.length) return []
  const scored = KB.map((c) => {
    const hay = (c.t + ' ' + c.x).toLowerCase()
    let s = 0
    for (const t of ts) if (hay.includes(t)) s += t.length > 1 ? 2 : 1
    // 标题命中加权
    const ht = c.t.toLowerCase()
    for (const t of ts) if (t.length > 1 && ht.includes(t)) s += 3
    return { c, s }
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, k)
  return scored.map((x) => x.c)
}

function buildSystemPrompt(context: Chunk[]): string {
  const ctx = context.map((c, i) => `【资料${i + 1}·${c.t}】\n${c.x}`).join('\n\n')
  return [
    '你是《口袋怪兽2 / 口袋精灵2》攻略图鉴 Wiki 的 AI 助手。',
    '请依据下方「参考资料」回答玩家关于宠物、合成、涅槃、装备、任务、地图掉落、数值等问题。',
    '要求：',
    '1. 优先使用参考资料中的信息；资料里没有的，就说明你不确定，不要编造数据或公式。',
    '2. 回答用简洁中文，可用 Markdown 列表/表格让结构清晰。',
    '3. 涉及合成/涅槃时给出完整公式（材料=产物）。',
    '',
    '===== 参考资料 =====',
    ctx || '（本次未检索到相关资料）',
    '===== 资料结束 =====',
  ].join('\n')
}

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' }

async function handleChat(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: JSON_HEADERS })
  }
  if (!env.DEEPSEEK_API_KEY) {
    return new Response(JSON.stringify({ error: 'AI 未配置：请在 Cloudflare 设置 DEEPSEEK_API_KEY 密钥。' }), { status: 503, headers: JSON_HEADERS })
  }
  let body: any
  try { body = await request.json() } catch { return new Response(JSON.stringify({ error: 'Bad JSON' }), { status: 400, headers: JSON_HEADERS }) }
  const messages: { role: string; content: string }[] = Array.isArray(body?.messages) ? body.messages : []
  if (!messages.length) return new Response(JSON.stringify({ error: '缺少 messages' }), { status: 400, headers: JSON_HEADERS })

  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content || ''
  const context = retrieve(lastUser)
  const system = { role: 'system', content: buildSystemPrompt(context) }
  // 只保留最近若干轮，避免过长
  const history = messages.slice(-12)

  const base = env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
  // 模型名（可用 DEEPSEEK_MODEL 覆盖）。注意：若用官方 api.deepseek.com，有效名为
  // deepseek-chat / deepseek-reasoner；自定义网关请相应设置 DEEPSEEK_MODEL / DEEPSEEK_BASE_URL。
  const model = env.DEEPSEEK_MODEL || 'deepseek-v4-pro'

  const upstream = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({ model, messages: [system, ...history], stream: true, temperature: 0.3 }),
  })

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => '')
    let detail = errText.slice(0, 400)
    try { detail = JSON.parse(errText)?.error?.message || detail } catch { /* keep raw */ }
    return new Response(JSON.stringify({ error: `上游错误 ${upstream.status}：${detail}（模型=${model}）` }), { status: 502, headers: JSON_HEADERS })
  }
  // 直接把 SSE 流透传给前端
  return new Response(upstream.body, {
    headers: {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
    },
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === '/api/chat') return handleChat(request, env)
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ ok: true, configured: !!env.DEEPSEEK_API_KEY, chunks: KB.length }), { headers: JSON_HEADERS })
    }
    // 其余交给静态资源（SPA）
    return env.ASSETS.fetch(request)
  },
}
