import { useEffect, useRef, useState } from 'react'
import { FloatButton, Input, Button, Avatar, Tag, theme } from 'antd'
import { RobotOutlined, CloseOutlined, SendOutlined, UserOutlined } from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Msg { role: 'user' | 'assistant'; content: string }

// 自定义机器人头像：把图片放到 public/ai-avatar.gif 即生效；加载失败则回退到机器人图标。
const AVATAR_URL = `${import.meta.env.BASE_URL}ai-avatar.gif`

const WELCOME: Msg = {
  role: 'assistant',
  content: '你好！我是《口袋怪兽2》攻略助手 🐲\n可以问我宠物合成/涅槃公式、专属任务、地图掉落、装备搭配、伤害计算等问题。',
}
const SAMPLES = ['小神龙琅琊怎么合成？', '玄冰仙使合成链', '红石块在哪刷？', '涅槃需要什么材料？']

export default function AiAssistant() {
  const { token } = theme.useToken()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [avatarOk, setAvatarOk] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const im = new Image()
    im.onload = () => setAvatarOk(true)
    im.onerror = () => setAvatarOk(false)
    im.src = AVATAR_URL
  }, [])
  const botIcon = avatarOk
    ? <img src={AVATAR_URL} alt="AI" style={{ width: '1em', height: '1em', borderRadius: '50%', objectFit: 'cover' }} />
    : <RobotOutlined />
  const botAvatar = (size: number, bg: string) =>
    avatarOk
      ? <Avatar size={size} src={AVATAR_URL} style={{ flex: '0 0 auto' }} />
      : <Avatar size={size} icon={<RobotOutlined />} style={{ flex: '0 0 auto', background: bg }} />

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  async function send(text: string) {
    text = text.trim()
    if (!text || loading) return
    const history = messages.concat({ role: 'user', content: text })
    setMessages(history.concat({ role: 'assistant', content: '' }))
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      if (!res.ok || !res.body) {
        const e = await res.json().catch(() => ({}))
        throw new Error((e as any).error || `HTTP ${res.status}`)
      }
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let acc = ''
      let buf = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() || ''
        for (const line of lines) {
          const l = line.trim()
          if (!l.startsWith('data:')) continue
          const data = l.slice(5).trim()
          if (data === '[DONE]' || !data) continue
          try {
            const j = JSON.parse(data)
            const d = j.choices?.[0]?.delta?.content
            if (d) {
              acc += d
              setMessages((m) => {
                const c = m.slice()
                c[c.length - 1] = { role: 'assistant', content: acc }
                return c
              })
            }
          } catch { /* 忽略心跳/非 JSON 行 */ }
        }
      }
      if (!acc) {
        setMessages((m) => {
          const c = m.slice()
          c[c.length - 1] = { role: 'assistant', content: '（未返回内容）' }
          return c
        })
      }
    } catch (err: any) {
      setMessages((m) => {
        const c = m.slice()
        c[c.length - 1] = {
          role: 'assistant',
          content: '⚠️ ' + (err?.message || '请求失败') + '\n\n（AI 需部署到 Cloudflare 并配置 DEEPSEEK_API_KEY 后才能使用；本地可用 `npx wrangler dev` 调试。）',
        }
        return c
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!open && (
        <FloatButton
          type="primary"
          icon={botIcon}
          tooltip="AI 攻略助手"
          onClick={() => setOpen(true)}
          style={{ width: 52, height: 52, insetInlineEnd: 28, insetBlockEnd: 28 }}
        />
      )}
      {open && (
        <div
          style={{
            position: 'fixed', right: 24, bottom: 24, zIndex: 1000,
            width: 'min(400px, calc(100vw - 32px))', height: 'min(600px, calc(100vh - 100px))',
            display: 'flex', flexDirection: 'column',
            background: token.colorBgElevated, border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: 16, boxShadow: token.boxShadowSecondary, overflow: 'hidden',
          }}
        >
          {/* 头部 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
            background: 'linear-gradient(120deg,#5b7cff,#7d5cff)', color: '#fff',
          }}>
            {avatarOk
              ? <Avatar size={30} src={AVATAR_URL} />
              : <Avatar size={30} icon={<RobotOutlined />} style={{ background: 'rgba(255,255,255,.25)' }} />}
            <div style={{ flex: 1, lineHeight: 1.2 }}>
              <div style={{ fontWeight: 600 }}>口袋怪兽2 · AI 助手</div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>基于站内攻略资料回答</div>
            </div>
            <Button type="text" icon={<CloseOutlined />} onClick={() => setOpen(false)} style={{ color: '#fff' }} />
          </div>

          {/* 消息区 */}
          <div ref={bodyRef} style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                {m.role === 'user'
                  ? <Avatar size={28} icon={<UserOutlined />} style={{ flex: '0 0 auto', background: token.colorPrimary }} />
                  : botAvatar(28, '#7d5cff')}
                <div
                  className={m.role === 'assistant' ? 'ai-md' : undefined}
                  style={{
                    maxWidth: '82%', padding: '8px 12px', borderRadius: 12, fontSize: 13.5, lineHeight: 1.7,
                    wordBreak: 'break-word',
                    whiteSpace: m.role === 'user' ? 'pre-wrap' : undefined,
                    background: m.role === 'user' ? token.colorPrimary : token.colorFillSecondary,
                    color: m.role === 'user' ? '#fff' : token.colorText,
                  }}
                >
                  {m.role === 'user'
                    ? m.content
                    : m.content
                      ? <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{ a: (p) => <a {...p} target="_blank" rel="noreferrer" /> }}
                        >{m.content}</ReactMarkdown>
                      : (loading && i === messages.length - 1 ? '思考中…' : '')}
                </div>
              </div>
            ))}
            {messages.length <= 1 && (
              <div style={{ marginTop: 4 }}>
                <div style={{ fontSize: 12, color: token.colorTextTertiary, marginBottom: 6 }}>试试这些问题：</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {SAMPLES.map((s) => (
                    <Tag key={s} color="blue" style={{ cursor: 'pointer', margin: 0 }} onClick={() => send(s)}>{s}</Tag>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 输入区 */}
          <div style={{ padding: 10, borderTop: `1px solid ${token.colorBorderSecondary}`, display: 'flex', gap: 8 }}>
            <Input.TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入问题，回车发送…"
              autoSize={{ minRows: 1, maxRows: 4 }}
              onPressEnter={(e) => { if (!e.shiftKey) { e.preventDefault(); send(input) } }}
              disabled={loading}
            />
            <Button type="primary" icon={<SendOutlined />} loading={loading} onClick={() => send(input)} />
          </div>
        </div>
      )}
    </>
  )
}
