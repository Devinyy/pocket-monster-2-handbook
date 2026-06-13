import { createContext, useContext, useState, ReactNode } from 'react'

interface Ctx { el: string | null; setEl: (e: string | null) => void }
const ElementFilterCtx = createContext<Ctx>({ el: null, setEl: () => {} })

export function ElementFilterProvider({ children }: { children: ReactNode }) {
  const [el, setEl] = useState<string | null>(null)
  return <ElementFilterCtx.Provider value={{ el, setEl }}>{children}</ElementFilterCtx.Provider>
}

export function useElementFilter() {
  return useContext(ElementFilterCtx)
}
