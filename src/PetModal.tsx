import { createContext, useContext, useState, ReactNode } from 'react'
import { Modal, Image, Typography, Tag } from 'antd'
import { findPet, imgUrl } from './data'
import type { FoundPet } from './data'
import { seriesColor } from './elements'

const { Text } = Typography

interface Ctx { open: (name: string) => boolean }
const PetModalCtx = createContext<Ctx>({ open: () => false })
export const usePetModal = () => useContext(PetModalCtx)

function PetDetailView({ f }: { f: FoundPet }) {
  const { pet } = f
  const cc = seriesColor(f.seriesIndex)
  return (
    <div>
      <div style={{
        display: 'flex', gap: 16, alignItems: 'center', marginBottom: 14,
        paddingBottom: 14, borderBottom: '1px solid rgba(127,127,127,.15)',
      }}>
        <div style={{
          width: 130, height: 130, flex: '0 0 auto', borderRadius: 12, padding: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `radial-gradient(circle at 50% 40%, ${cc}22, transparent 68%)`,
          borderTop: `3px solid ${cc}`,
        }}>
          {pet.sprite
            ? <Image src={imgUrl('petsprite', pet.sprite)} alt={pet.name} style={{ maxHeight: 114, width: 'auto', objectFit: 'contain' }} />
            : <Text type="secondary">暂无立绘</Text>}
        </div>
        <div>
          <Tag color="blue" style={{ marginBottom: 6 }}>{f.series}</Tag>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{pet.name}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>共 {pet.skills.length} 个技能</Text>
        </div>
      </div>

      {pet.skills.length > 0 ? pet.skills.map((sk, j) => (
        <div key={j} style={{ fontSize: 13, marginBottom: 8, lineHeight: 1.7 }}>
          <Text strong style={{ color: cc }}>{sk.name}</Text>
          {sk.desc && <Text type="secondary">：{sk.desc}</Text>}
        </div>
      )) : <Text type="secondary">技能未收录</Text>}

      {pet.obtain.length > 0 && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed rgba(127,127,127,.25)' }}>
          {pet.obtain.map((o, k) => (
            <div key={k} style={{ fontSize: 13, color: '#3aa76d', lineHeight: 1.7 }}>{o}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export function PetModalProvider({ children }: { children: ReactNode }) {
  const [found, setFound] = useState<FoundPet | null>(null)
  const open = (name: string) => {
    const f = findPet(name)
    if (f) { setFound(f); return true }
    return false
  }
  return (
    <PetModalCtx.Provider value={{ open }}>
      {children}
      <Modal
        open={!!found}
        onCancel={() => setFound(null)}
        footer={null}
        width={540}
        title="宠物详情"
        destroyOnClose
      >
        {found && <PetDetailView f={found} />}
      </Modal>
    </PetModalCtx.Provider>
  )
}
