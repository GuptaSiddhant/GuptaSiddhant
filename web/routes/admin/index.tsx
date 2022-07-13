import { createAdminMeta } from "@gs/admin/helpers"
import { H1, Paragraph } from "@gs/ui/Text"

export default function AdminIndex(): JSX.Element | null {
  return (
    <main className="hidden flex-col text-disabled sm:flex-center">
      <H1>GS Admin</H1>
      <Paragraph>Select an app to begin</Paragraph>
    </main>
  )
}

export function meta() {
  return createAdminMeta()
}
