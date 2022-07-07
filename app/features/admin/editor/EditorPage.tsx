import SaveButton from "remixicon-react/Save2FillIcon"

import { type Model } from "~/features/models"
import Button from "~/features/ui/Button"

import AdminLayout from "../AdminLayout"
import EditorForm from "./EditorForm"

interface EditorPageProps<T> {
  item: T
  model: Model
}

export default function EditorPage<T extends EditorHeaderProps>({
  item,
  model,
}: EditorPageProps<T>): JSX.Element | null {
  const formId = `editor-${item.id}`

  return (
    <AdminLayout
      name={item.id}
      header={<EditorHeader {...item} />}
      className="p-4"
      key={formId}
      actions={[
        {
          id: "save",
          children: (
            <Button form={formId} type="submit" title="Save">
              <SaveButton />
            </Button>
          ),
        },
      ]}
    >
      <EditorForm id={formId} item={item} model={model} method="put" />
    </AdminLayout>
  )
}

interface EditorHeaderProps {
  id: string
  icon?: string
}

function EditorHeader({ icon, id }: EditorHeaderProps): JSX.Element | null {
  if (!icon) return <strong>{id}</strong>

  return (
    <div className="flex items-center gap-2">
      <img src={icon} className="h-6 w-6 rounded-sm  object-cover" alt={id} />
      <strong>{id}</strong>
    </div>
  )
}
