import { useMemo } from "react"

import { useNavigate } from "@remix-run/react"

import { useToggleTheme } from "@gs/theme/ThemeToggleButton"

import useSearch from "."

const COMMAND_KEY = ">"

export interface Command {
  id: string
  onClick: () => void
  title: string
}

export function isCommand(str: string = ""): boolean {
  return Boolean(str?.startsWith(COMMAND_KEY))
}

export function useCommands(): Command[] {
  const toggleTheme = useToggleTheme()
  const navigate = useNavigate()
  const { inputValue = "" } = useSearch()

  const commandValue = inputValue
    .trim()
    .split(COMMAND_KEY)
    .slice(1)
    .map((t) => t.trim())
    .join(COMMAND_KEY)
    .toLowerCase()

  const commands: Command[] = useMemo(
    () => [
      {
        id: "theme",
        title: "Toggle theme",
        onClick: toggleTheme,
      },
      {
        id: "Admin",
        onClick: () => navigate("/admin"),
        title: "Goto Admin",
        // shortcut: [ShortcutModifier.SHIFT, "Q"],
      },
    ],
    [toggleTheme, navigate],
  )

  return useMemo(
    () =>
      commands.filter((cmd) => cmd.title.toLowerCase().includes(commandValue)),
    [commands, commandValue],
  )
}
