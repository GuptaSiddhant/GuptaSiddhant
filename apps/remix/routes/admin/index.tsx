import { createAdminMeta } from "~/features/admin/helpers"
import { H1, Paragraph } from "~/features/ui/Text"

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
