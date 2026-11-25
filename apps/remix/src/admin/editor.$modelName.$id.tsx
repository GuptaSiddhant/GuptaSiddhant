import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  data,
  redirect,
  useLoaderData,
} from "react-router";

import {
  type Model,
  ModelName,
  getLabelByModelName,
  getModelByModelName,
  verifyValidModelName,
} from "@gs/models";
import { getProjectAssociationKeys } from "@gs/models/projects.server";
import {
  getItemByModelName,
  mutateDatabaseByModelNameAndFormData,
} from "@gs/models/service.server";
import {
  authenticateRoute,
  isUserHasWriteAccess,
} from "@gs/service/auth.server";
import { UserRole } from "@gs/models/users.model";
import Database from "@gs/service/database.server";
import { getErrorMessage } from "@gs/utils/error";
import invariant from "@gs/utils/invariant";

import { AdminAppId, adminRegistry } from "./features";
import EditorPage from "./features/editor/EditorPage";
import { adminLogger } from "./features/logger.server";

const adminApp = adminRegistry.getApp(AdminAppId.Editor);

interface LoaderDataItem {
  [key: string]: unknown;
  id: string;
}

interface LoaderData {
  item?: LoaderDataItem;
  model: Model;
  modelName: ModelName;
  modelLabel: string;
  hasWriteAccess: boolean;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const user = await authenticateRoute(request, UserRole.EDITOR);
  const hasWriteAccess = await isUserHasWriteAccess(user);

  const { modelName: name, id } = params;
  invariant(name, "ModelName is required.");
  invariant(verifyValidModelName(name), `ModelName ${name} is invalid.`);
  invariant(id, `${name} id is required.`);

  const modelName = name as ModelName;
  const modelLabel = getLabelByModelName(modelName);
  const model = getModelByModelName(modelName);

  if (id === "new")
    return data<LoaderData>({ model, modelName, modelLabel, hasWriteAccess });

  try {
    const item = (await getItemByModelName(modelName, id)) as unknown as
      | LoaderDataItem
      | undefined;
    invariant(item, `${modelLabel} item not found.`);

    const enrichedModel = await enrichModel(modelName, model);

    return data<LoaderData>({
      item,
      model: enrichedModel,
      modelLabel,
      modelName,
      hasWriteAccess,
    });
  } catch (e) {
    adminLogger.error(getErrorMessage(e));

    return redirect(adminApp.linkPath + modelName);
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await authenticateRoute(request, UserRole.EDITOR);
  invariant(
    await isUserHasWriteAccess(user),
    `The user '${user.email}' does not have write-access.`,
  );

  const { pathname } = new URL(request.url);
  const formData = await request.formData();

  const { modelName: name } = params;
  invariant(name, "ModelName is required.");
  const modelName = name as ModelName;

  const id = formData.get("id")?.toString();
  invariant(id, `${modelName} id is required.`);

  const database = new Database(modelName);

  if (request.method === "DELETE") {
    const deleted = await database.mutateById(id);
    return redirect(generateRedirectUrl(modelName, deleted ? "" : id));
  }

  console.log("formData", Array.from(formData.entries()));
  await mutateDatabaseByModelNameAndFormData(modelName, formData, database, id);

  return redirect(generateRedirectUrl(modelName, id) || pathname);
}

export default function Editor(): JSX.Element | null {
  const { item, model, modelName, modelLabel, hasWriteAccess } =
    useLoaderData<LoaderData>();

  return (
    <EditorPage
      item={item}
      model={model}
      basePreviewPath={modelName}
      headerPrefix={modelLabel}
      readonly={!hasWriteAccess}
    />
  );
}

// Helpers

async function enrichModel(modelName: ModelName, model: Model): Promise<Model> {
  if (modelName === ModelName.Projects) {
    const assocKeys = await getProjectAssociationKeys();

    if (model.type === "object") {
      // Add options to association property
      model.properties["association"] = {
        ...(model.properties["association"] || {}),
        type: "string",
        enum: ["", ...assocKeys],
      };
    }
  }

  return model;
}

function generateRedirectUrl(...paths: string[]) {
  return ["/admin/editor", ...paths].join("/");
}
