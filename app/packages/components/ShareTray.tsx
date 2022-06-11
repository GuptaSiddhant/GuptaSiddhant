import { CopyButton } from "./Button"

export interface ShareTrayProps {
  url?: string
}

export default function ShareTray({ url }: ShareTrayProps): JSX.Element | null {
  if (!url) return null

  return (
    <div className="flex flex-end gap-4 items-center">
      <CopyButton>{url}</CopyButton>
    </div>
  )
}
