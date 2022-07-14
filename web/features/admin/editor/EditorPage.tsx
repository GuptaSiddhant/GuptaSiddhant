import { DeleteIcon, RefreshIcon } from "@gs/icons"
import { type Model } from "@gs/models"
import Action from "@gs/ui/Action"
import Button from "@gs/ui/Button"
import { getDeleteConfirmProps } from "@gs/ui/Popover/Confirm"
import PreviewIcon from "remixicon-react/EyeLineIcon"
import SaveIcon from "remixicon-react/Save2FillIcon"

import type { NavigationLinkProps } from "~/features/navigation/types"

import AdminLayout from "../layout/AdminLayout"
import EditorForm from "./EditorForm"

interface EditorPageProps<T> {
  headerPrefix: string
  item?: T
  model: Model
  basePreviewPath: string
}

export default function EditorPage<T extends EditorHeaderProps>({
  item,
  model,
  headerPrefix = "New",
  basePreviewPath,
}: EditorPageProps<T>): JSX.Element | null {
  const formId = item ? `editor-${item.id}` : "editor-new"
  const name = headerPrefix + ": " + (item?.id || "new")

  const existingItemActions: NavigationLinkProps[] = item
    ? [
        {
          id: "Refresh",
          children: (
            <Action.Form
              method="patch"
              body={{ id: item.id }}
              title="Refresh entry"
              reloadDocument
            >
              <RefreshIcon />
            </Action.Form>
          ),
        },
        {
          id: "Delete",
          children: (
            <Action
              method="delete"
              body={{ id: item.id }}
              title="Delete entry"
              confirm={getDeleteConfirmProps("entry")}
            >
              <DeleteIcon />
            </Action>
          ),
        },
        {
          id: "Preview",
          to: `/${basePreviewPath}/${item.id}`,
          external: true,
          children: <PreviewIcon />,
        },
      ]
    : []

  return (
    <AdminLayout
      title={name}
      header={<EditorHeader id={name} icon={item?.icon} />}
      key={formId}
      className="p-4"
      actions={[
        {
          id: "save",
          children: (
            <Button form={formId} type="submit" title="Save">
              <SaveIcon />
            </Button>
          ),
        },
        ...existingItemActions,
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
