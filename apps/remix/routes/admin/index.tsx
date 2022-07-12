import { createAdminMeta } from "~/features/admin/helpers"
import { H1, Paragraph } from "~/features/ui/Text"

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
