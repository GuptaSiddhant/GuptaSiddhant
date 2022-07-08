import SaveButton from "remixicon-react/Save2FillIcon"

import { DeleteIcon, RefreshIcon } from "@gs/icons"
import { type Model } from "~/features/models"
import Button from "~/features/ui/Button"
import FormAction from "~/features/ui/FormAction"
import { getDeleteConfirmProps } from "~/features/ui/Popover/Confirm"

import AdminLayout from "../AdminLayout"
import EditorForm from "./EditorForm"

interface EditorPageProps<T> {
  headerPrefix: string
  item?: T
  model: Model
}

export default function EditorPage<T extends EditorHeaderProps>({
  item,
  model,
  headerPrefix = "New",
}: EditorPageProps<T>): JSX.Element | null {
  const formId = item ? `editor-${item.id}` : "editor-new"
  const name = headerPrefix + ": " + (item?.id || "new")

  return (
    <AdminLayout
      name={name}
      header={<EditorHeader id={name} icon={item?.icon} />}
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
        ...(item
          ? [
              {
                id: "Refresh",
                children: (
                  <FormAction
                    method="patch"
                    body={{ id: item.id }}
                    title="Refresh entry"
                  >
                    <RefreshIcon />
                  </FormAction>
                ),
              },
              {
                id: "Delete",
                children: (
                  <FormAction
                    method="delete"
                    body={{ id: item.id }}
                    title="Delete entry"
                    confirm={getDeleteConfirmProps("entry")}
                  >
                    <DeleteIcon />
                  </FormAction>
                ),
              },
            ]
          : []),
      ]}
    >
      <EditorForm
        formId={formId}
        item={item}
        model={model}
        method={item ? "put" : "post"}
      />
    </AdminLayout>
  )
}

interface EditorHeaderProps {
  id: string
  icon?: string
}

function EditorHeader({
  icon,
  id = "New",
}: EditorHeaderProps): JSX.Element | null {
  if (!icon) return <strong>{id}</strong>

  return (
    <div className="flex items-center gap-2">
      <img src={icon} className="h-6 w-6 rounded-sm  object-cover" alt={id} />
      <strong>{id}</strong>
    </div>
  )
}
