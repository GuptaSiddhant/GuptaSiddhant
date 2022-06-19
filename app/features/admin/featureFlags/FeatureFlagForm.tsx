import { Form } from "@remix-run/react"

import Button from "~/features/ui/Button"

export default function FeatureFlagForm(): JSX.Element | null {
  return (
    <Form method="post" className="border-r border-divider h-auto">
      <fieldset className="flex flex-col gap-4 p-4 [&_input]:ml-2 [&_label]:px-2 h-auto">
        <legend className="font-bold border-b border-divider w-full py-2 text-base">
          Create new feature flag
        </legend>
        <label>
          Key:
          <input
            type="text"
            placeholder="Feature flag key"
            name="flag"
            className="bg-default flex-1 rounded px-2 py-1 text-base"
            required
          />
        </label>
        <label>
          Dev:
          <input type="checkbox" name="dev" />
        </label>
        <label>
          Prod:
          <input type="checkbox" name="prod" />
        </label>
        <Button className="bg-secondary hocus:bg-tertiary px-2 py-1 rounded border border-gray-300 justify-center">
          Add feature flag
        </Button>
      </fieldset>
    </Form>
  )
}
