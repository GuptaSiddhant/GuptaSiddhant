import type { AdminAppProps } from "~/features/admin"
import { createAdminMeta } from "~/features/admin"
import { H1, Paragraph } from "~/features/ui/Text"

import { handle as cache } from "./cache"
import { handle as editor } from "./editor"
import { handle as settings } from "./settings"
import { handle as storage } from "./storage"

export const handle: {
  apps: AdminAppProps[]
} = {
  apps: [editor, storage, cache, settings].map(({ adminApp }) => adminApp),
}

export default function AdminIndex(): JSX.Element | null {
  return (
    <main className="flex-col text-disabled flex-center">
      <H1>GS Admin</H1>
      <Paragraph>Select an app to begin</Paragraph>
    </main>
  )
}

export function meta() {
  return createAdminMeta()
}