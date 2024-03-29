import PreviewIcon from "remixicon-react/EyeLineIcon";
import SaveIcon from "remixicon-react/Save2FillIcon";

import { DeleteIcon, RefreshIcon } from "@gs/icons";
import { type Model } from "@gs/models";
import useNavigationSubmissionToast from "@gs/toaster/useNavigationSubmissionToast";
import type { NavigationLinkProps } from "@gs/types";
import Action from "@gs/ui/Action";
import Button from "@gs/ui/Button";
import { getDeleteConfirmProps } from "@gs/ui/Popover/Confirm";
import {
  assetTransformationOptions,
  generateAssetTransformedUrl,
} from "@gs/utils/asset-transformer";

import AdminLayout from "../layout";
import EditorForm from "./EditorForm";

interface EditorPageProps<T> {
  headerPrefix: string;
  item?: T;
  model: Model;
  basePreviewPath?: string;
  readonly?: boolean;
}

export default function EditorPage<T extends EditorHeaderProps>({
  item,
  model,
  headerPrefix = "New",
  basePreviewPath,
  readonly = true,
}: EditorPageProps<T>): JSX.Element | null {
  const formId = item ? `editor-${item.id}` : "editor-new";
  const name = `${headerPrefix}: ${item?.id || "new"}`;

  const existingItemActions: NavigationLinkProps[] = [];

  if (item) {
    existingItemActions.push({
      id: "Refresh",
      children: (
        <Action.Form
          method="POST"
          body={{ id: item.id, invalidate: true }}
          title="Refresh entry"
          reloadDocument
        >
          <RefreshIcon />
        </Action.Form>
      ),
    });

    if (basePreviewPath) {
      if (!readonly) {
        existingItemActions.push({
          id: "Delete",
          children: (
            <Action
              method="DELETE"
              body={{ id: item.id }}
              title="Delete entry"
              confirm={getDeleteConfirmProps("entry")}
            >
              <DeleteIcon />
            </Action>
          ),
        });
      }
      existingItemActions.push({
        id: "Preview",
        to: `/${basePreviewPath}/${item.id}`,
        external: true,
        children: <PreviewIcon />,
      });
    }
  }

  useNavigationSubmissionToast({
    GET: "Loading entry...",
    POST: "Creating entry...",
    PUT: "Updating entry...",
    DELETE: "Deleting entry...",
    PATCH: "Refreshing entry...",
  });

  return (
    <AdminLayout
      title={name}
      header={<EditorHeader id={name} icon={item?.icon} />}
      key={formId}
      className="p-4"
      actions={
        readonly
          ? existingItemActions
          : [
              {
                id: "save",
                children: (
                  <Button form={formId} type="submit" title="Save">
                    <SaveIcon />
                  </Button>
                ),
              },
              ...existingItemActions,
            ]
      }
    >
      <EditorForm formId={formId} data={item} model={model} />
    </AdminLayout>
  );
}

interface EditorHeaderProps {
  id: string;
  icon?: string;
}

function EditorHeader({
  icon,
  id = "New",
}: EditorHeaderProps): JSX.Element | null {
  if (!icon) {
    return <strong>{id}</strong>;
  }

  const iconUrl = generateAssetTransformedUrl(icon, {
    ...assetTransformationOptions.ICON,
    dpr: 1,
  });

  return (
    <div className="flex items-center gap-2">
      <img
        src={iconUrl}
        className="h-6 w-6 rounded-sm  object-cover"
        alt={id}
      />
      <strong>{id}</strong>
    </div>
  );
}
