import type { AdminAppProps } from "~/packages/admin"
import { H1, Paragraph } from "~/packages/components/Text"

import { handle as cacheHandle } from "./cache"

export default function AdminIndex(): JSX.Element | null {
  return (
    <main className="flex-center flex-col text-disabled">
      <H1>GS Admin</H1>
      <Paragraph>Select an app to begin</Paragraph>
    </main>
  )
}

export const handle: {
  apps: AdminAppProps[]
} = {
  apps: [cacheHandle.adminApp],
}
