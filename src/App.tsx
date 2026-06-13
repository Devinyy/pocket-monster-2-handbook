import { useMemo, useState } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Layout, Menu, ConfigProvider, theme as antdTheme, AutoComplete, Input, Button, Grid, Drawer, Tag } from 'antd'
import {
  HomeOutlined, RocketOutlined, ExperimentOutlined, BugOutlined, FireOutlined,
  FileTextOutlined, SafetyOutlined, BarChartOutlined, ThunderboltOutlined,
  SearchOutlined, MenuOutlined, BulbOutlined, BulbFilled, EnvironmentOutlined,
} from '@ant-design/icons'
import zhCN from 'antd/locale/zh_CN'
import { searchIndex } from './data'

import Home from './pages/Home'
import Guide from './pages/Guide'
import Synthesis from './pages/Synthesis'
import Pets from './pages/Pets'
import NewPets from './pages/NewPets'
import Tasks from './pages/Tasks'
import Maps from './pages/Maps'
import Boss from './pages/Boss'
import Equipment from './pages/Equipment'
import DataTools from './pages/DataTools'
import AiAssistant from './components/AiAssistant'

const { Header, Sider, Content } = Layout
const { useBreakpoint } = Grid

const MENU = [
  { key: '/', icon: <HomeOutlined />, label: '首页' },
  { key: '/guide', icon: <RocketOutlined />, label: '新手入门' },
  { key: '/synthesis', icon: <ExperimentOutlined />, label: '合成 · 涅槃' },
  { key: '/pets', icon: <BugOutlined />, label: '宠物图鉴' },
  { key: '/newpets', icon: <ThunderboltOutlined />, label: '新宠技能库' },
  { key: '/tasks', icon: <FileTextOutlined />, label: '专属任务' },
  { key: '/maps', icon: <EnvironmentOutlined />, label: '地图图鉴' },
  { key: '/boss', icon: <FireOutlined />, label: 'BOSS 图鉴' },
  { key: '/equipment', icon: <SafetyOutlined />, label: '装备 · 卡片' },
  { key: '/data', icon: <BarChartOutlined />, label: '数值工具' },
]

const CAT_COLOR: Record<string, string> = {
  宠物图鉴: 'blue', 新宠技能: 'purple', 专属任务: 'gold', BOSS: 'red',
  '装备/卡片': 'green', 涅槃加成: 'magenta', 新手入门: 'cyan', '合成/涅槃': 'geekblue', 数值工具: 'orange',
  地图: 'green', 副本: 'volcano', 材料: 'gold',
}

function GlobalSearch() {
  const navigate = useNavigate()
  const [val, setVal] = useState('')
  const options = useMemo(() => {
    const t = val.trim().toLowerCase()
    if (!t) return []
    return searchIndex
      .filter((it) => it.name.toLowerCase().includes(t) || (it.kw || '').toLowerCase().includes(t))
      .slice(0, 30)
      .map((it) => ({
        value: it.path + '||' + it.name,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <span>{it.name}</span>
            <Tag color={CAT_COLOR[it.cat] || 'default'} style={{ marginInlineEnd: 0 }}>{it.cat}</Tag>
          </div>
        ),
      }))
  }, [val])

  return (
    <AutoComplete
      value={val}
      options={options}
      style={{ width: '100%', maxWidth: 520 }}
      onChange={setVal}
      onSelect={(v: string) => { navigate(v.split('||')[0]); setVal('') }}
      popupMatchSelectWidth={480}
    >
      <Input
        size="middle"
        allowClear
        prefix={<SearchOutlined />}
        placeholder="搜索宠物 / 装备 / 任务 / 公式…"
        suffix={<kbd style={{
          fontSize: 10, color: 'rgba(255,255,255,.35)',
          border: '1px solid rgba(255,255,255,.12)',
          borderRadius: 4, padding: '1px 6px', lineHeight: '18px',
          fontFamily: 'monospace',
        }}>/</kbd>}
      />
    </AutoComplete>
  )
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const screens = useBreakpoint()
  const isMobile = !screens.lg
  const [dark, setDark] = useState(true)
  const [drawer, setDrawer] = useState(false)

  const activeKey = '/' + (location.pathname.split('/')[1] || '')

  const menu = (
    <Menu
      mode="inline"
      theme={dark ? 'dark' : 'light'}
      selectedKeys={[activeKey]}
      items={MENU}
      style={{ borderInlineEnd: 'none' }}
      onClick={({ key }) => { navigate(key); setDrawer(false) }}
    />
  )

  const brand = (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '18px 20px',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        display: 'grid', placeItems: 'center', flexShrink: 0,
        background: dark
          ? 'linear-gradient(140deg, #212b3c, #1a2233)'
          : 'linear-gradient(140deg, #eef1ff, #e8ecff)',
        border: `1px solid ${dark ? 'rgba(255,255,255,.1)' : 'rgba(91,124,255,.2)'}`,
        boxShadow: dark
          ? 'inset 0 0 0 1px rgba(91,124,255,.15), 0 0 14px -4px rgba(91,124,255,.18)'
          : '0 2px 6px rgba(91,124,255,.12)',
        fontSize: 18,
      }}>🐉</div>
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: .5 }}>口袋怪兽2</div>
        <div style={{
          fontSize: 10.5, letterSpacing: 1.5,
          color: dark ? 'rgba(255,255,255,.4)' : '#999',
          textTransform: 'uppercase' as const,
        }}>攻略 · 图鉴 Wiki</div>
      </div>
    </div>
  )

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#5b7cff',
          borderRadius: 10,
          colorBgContainer: dark ? '#151b28' : '#fff',
          colorBgElevated: dark ? '#1a2233' : '#fff',
          colorBorderSecondary: dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', Roboto, sans-serif",
        },
        components: {
          Card: { borderRadiusLG: 14 },
          Table: { borderRadiusLG: 12 },
          Alert: { borderRadiusLG: 10 },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }} className={dark ? 'dark' : ''}>
        {!isMobile && (
          <Sider
            theme={dark ? 'dark' : 'light'}
            width={240}
            style={{
              position: 'sticky', top: 0, zIndex: 11, height: '100vh', overflow: 'auto',
              borderInlineEnd: `1px solid ${dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)'}`,
            }}
          >
            {brand}
            {menu}
            <div style={{
              padding: '20px 20px 16px',
              marginTop: 'auto',
              fontSize: 11, lineHeight: 1.6,
              color: dark ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.25)',
            }}>
              资料整理自玩家社区<br />仅供学习交流
            </div>
          </Sider>
        )}
        <Layout>
          <Header style={{
            position: 'sticky', top: 0, zIndex: 20,
            display: 'flex', alignItems: 'center', gap: 12,
            padding: isMobile ? '0 14px' : '0 28px',
            height: 56,
            background: dark ? 'rgba(12,16,24,.82)' : 'rgba(255,255,255,.88)',
            backdropFilter: 'blur(14px)',
            borderBottom: `1px solid ${dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.06)'}`,
          }}>
            {isMobile && <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawer(true)} />}
            {isMobile && <span style={{ fontSize: 22 }}>🐉</span>}
            <div style={{ flex: 1, display: 'flex', justifyContent: isMobile ? 'flex-start' : 'center' }}>
              <GlobalSearch />
            </div>
            <Button
              type="text"
              icon={dark ? <BulbFilled style={{ color: '#faad14' }} /> : <BulbOutlined />}
              onClick={() => setDark((d) => !d)}
              title="切换深色模式"
            />
          </Header>
          <Content style={{
            padding: isMobile ? 16 : '24px 36px',
            maxWidth: 1280, width: '100%', margin: '0 auto',
            position: 'relative', zIndex: 1,
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/synthesis" element={<Synthesis />} />
              <Route path="/pets" element={<Pets />} />
              <Route path="/newpets" element={<NewPets />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/maps" element={<Maps />} />
              <Route path="/boss" element={<Boss />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/data" element={<DataTools />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <div style={{
              textAlign: 'center', fontSize: 11, padding: '36px 0 12px',
              color: dark ? 'rgba(255,255,255,.2)' : '#bbb',
              letterSpacing: .5,
            }}>
              资料整理自《口袋怪兽2 / 口袋精灵2》玩家社区 · 仅供学习交流
            </div>
          </Content>
        </Layout>
        <Drawer
          placement="left" open={drawer} onClose={() => setDrawer(false)}
          width={260}
          styles={{ body: { padding: 0 } }}
          title={brand}
        >
          {menu}
        </Drawer>
        <AiAssistant />
      </Layout>
    </ConfigProvider>
  )
}
