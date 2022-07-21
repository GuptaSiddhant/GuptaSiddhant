import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import invariant from "tiny-invariant"

import { useLocation, useNavigate } from "@remix-run/react"

export interface LifelineContextValue {
  selectedId?: string
  changeSelectedId: (id?: string) => void
}

const LifelineContext = createContext<LifelineContextValue | undefined>(
  undefined,
)

export function LifelineContextProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element | null {
  const { search } = useLocation()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  const changeSelectedId = useCallback((id?: string) => setSelectedId(id), [])

  useEffect(() => {
    if (selectedId) navigate({ hash: selectedId, search })
  }, [navigate, selectedId, search])

  useEffect(() => {
    const hash = window.location.hash.split("#")[1]
    if (hash) setSelectedId(hash)
  }, [])

  return (
    <LifelineContext.Provider value={{ selectedId, changeSelectedId }}>
      {children}
    </LifelineContext.Provider>
  )
}

export default function useLifelineContext(): LifelineContextValue {
  const context = useContext(LifelineContext)
  invariant(context, "useLifelineContext must be used inside Lifeline")

  return context
}
