import { createContext, useContext } from "react"

export const WindowSizeContext = createContext({ width: 0, height: 0 })

export default function useWindowSize() {
  return useContext(WindowSizeContext)
}
