import { useMemo, useState } from 'react'
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Layout, Menu, ConfigProvider, theme as antdTheme, AutoComplete, Input, Button, Grid, Drawer, Tag } from 'antd'
import {
  HomeOutlined, RocketOutlined, ExperimentOutlined, BugOutlined, FireOutlined,
  FileTextOutlined, SafetyOutlined, BarChartOutlined, ThunderboltOutlined,
  SearchOutlined, MenuOutlined, BulbOutlined, BulbFilled,
} from '@ant-design/icons'
import zhCN from 'antd/locale/zh_CN'
import { searchIndex } from './data'

import Home from './pages/Home'
import Guide from './pages/Guide'
import Synthesis from './pages/Synthesis'
import Pets from './pages/Pets'
import NewPets from './pages/NewPets'
import Tasks from './pages/Tasks'
import Boss from './pages/Boss'
import Equipment from './pages/Equipment'
import DataTools from './pages/DataTools'

const { Header, Sider, Content } = Layout
const { useBreakpoint } = Grid

const MENU = [
  { key: '/', icon: <HomeOutlined />, label: '首页' },
  { key: '/guide', icon: <RocketOutlined />, label: '新手入门' },
  { key: '/synthesis', icon: <ExperimentOutlined />, label: '合成 · 涅槃' },
  { key: '/pets', icon: <BugOutlined />, label: '宠物图鉴' },
  { key: '/newpets', icon: <ThunderboltOutlined />, label: '新宠技能库' },
  { key: '/tasks', icon: <FileTextOutlined />, label: '专属任务' },
  { key: '/boss', icon: <FireOutlined />, label: 'BOSS 图鉴' },
  { key: '/equipment', icon: <SafetyOutlined />, label: '装备 · 卡片' },
  { key: '/data', icon: <BarChartOutlined />, label: '数值工具' },
]

const CAT_COLOR: Record<string, string> = {
  宠物图鉴: 'blue', 新宠技能: 'purple', 专属任务: 'gold', BOSS: 'red',
  '装备/卡片': 'green', 涅槃加成: 'magenta', 新手入门: 'cyan', '合成/涅槃': 'geekblue', 数值工具: 'orange',
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
      style={{ width: '100%', maxWidth: 480 }}
      onChange={setVal}
      onSelect={(v: string) => { navigate(v.split('||')[0]); setVal('') }}
      popupMatchSelectWidth={460}
    >
      <Input size="middle" allowClear prefix={<SearchOutlined />} placeholder="搜索宠物 / 装备 / 任务 / 公式…" />
    </AutoComplete>
  )
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const screens = useBreakpoint()
  const isMobile = !screens.lg
  const [dark, setDark] = useState(false)
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px' }}>
      <span style={{ fontSize: 26 }}>🐉</span>
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontWeight: 700, fontSize: 16 }}>口袋怪兽2</div>
        <div style={{ fontSize: 11, color: '#999' }}>攻略 · 图鉴 Wiki</div>
      </div>
    </div>
  )

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: dark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: { colorPrimary: '#5b7cff', borderRadius: 8 },
      }}
    >
      <Layout style={{ minHeight: '100vh' }} className={dark ? 'dark' : ''}>
        {!isMobile && (
          <Sider theme={dark ? 'dark' : 'light'} width={232} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'auto', borderInlineEnd: '1px solid rgba(127,127,127,.15)' }}>
            {brand}
            {menu}
          </Sider>
        )}
        <Layout>
          <Header style={{
            position: 'sticky', top: 0, zIndex: 10, display: 'flex', alignItems: 'center', gap: 12,
            padding: isMobile ? '0 14px' : '0 24px',
            background: dark ? '#141414' : '#fff',
            borderBottom: '1px solid rgba(127,127,127,.15)',
          }}>
            {isMobile && <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawer(true)} />}
            {isMobile && <span style={{ fontSize: 22 }}>🐉</span>}
            <div style={{ flex: 1, display: 'flex', justifyContent: isMobile ? 'flex-start' : 'center' }}>
              <GlobalSearch />
            </div>
            <Button type="text" icon={dark ? <BulbFilled /> : <BulbOutlined />} onClick={() => setDark((d) => !d)} title="切换深色模式" />
          </Header>
          <Content style={{ padding: isMobile ? 16 : '24px 32px', maxWidth: 1240, width: '100%', margin: '0 auto' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/synthesis" element={<Synthesis />} />
              <Route path="/pets" element={<Pets />} />
              <Route path="/newpets" element={<NewPets />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/boss" element={<Boss />} />
              <Route path="/equipment" element={<Equipment />} />
              <Route path="/data" element={<DataTools />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <div style={{ textAlign: 'center', color: '#999', fontSize: 12, padding: '32px 0 8px' }}>
              资料整理自《口袋怪兽2 / 口袋精灵2》玩家社区 · 仅供学习交流
            </div>
          </Content>
        </Layout>
        <Drawer placement="left" open={drawer} onClose={() => setDrawer(false)} width={232} styles={{ body: { padding: 0 } }} title={brand}>
          {menu}
        </Drawer>
      </Layout>
    </ConfigProvider>
  )
}
