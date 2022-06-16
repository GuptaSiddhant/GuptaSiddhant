import { H1, Paragraph } from "~/packages/components/Text"

export default function AdminIndex(): JSX.Element | null {
  return (
    <main className="flex-center flex-col text-disabled">
      <H1>GS Admin</H1>
      <Paragraph>Select an app to begin</Paragraph>
    </main>
  )
}
