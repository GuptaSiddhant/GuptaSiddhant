import { createContext, useContext } from "react"

import {
  type FontType,
  type ResumeColors,
  type ResumeTexts,
  generateColors,
  generateTexts,
} from "./theme"

interface ResumeContextValue {
  colors: ResumeColors
  texts: ResumeTexts
}

const ResumeContext = createContext<ResumeContextValue | undefined>(undefined)

export default function useResumeContext() {
  const ctx = useContext(ResumeContext)
  if (!ctx)
    throw new Error("useResumeContext must be used within a ResumeContext")

  return ctx
}

export function ResumeContextProvider({
  children,
  font,
  color,
}: {
  font: FontType
  color?: string
  children: React.ReactNode
}): JSX.Element | null {
  const texts = generateTexts(font)
  const colors = generateColors(color?.toLowerCase())

  return (
    <ResumeContext.Provider value={{ texts, colors }}>
      {children}
    </ResumeContext.Provider>
  )
}
