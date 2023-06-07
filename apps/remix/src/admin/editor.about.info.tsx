import { useLoaderData } from "@remix-run/react";
import {
  type DataFunctionArgs,
  json,
  redirect,
} from "@remix-run/server-runtime";

import { type Model, ModelName, getModelByModelName } from "@gs/models";
import type { AboutInfo } from "@gs/models/about.server";
import {
  aboutInfoKey,
  getAboutDatabase,
  getAboutInfo,
  getAboutModelName,
} from "@gs/models/about.server";
import { getCareerKeys } from "@gs/models/career.server";
import { mutateDatabaseByModelNameAndFormData } from "@gs/models/service.server";
import {
  authenticateRoute,
  isUserHasWriteAccess,
} from "@gs/service/auth.server";
import { getErrorMessage } from "@gs/utils/error";

import { AdminAppId, adminRegistry } from "./features";
import EditorPage from "./features/editor/EditorPage";
import { adminLogger } from "./features/logger.server";

const adminApp = adminRegistry.getApp(AdminAppId.Editor);

interface LoaderData {
  info?: AboutInfo;
  model: Model;
  modelName: ModelName;
  hasWriteAccess: boolean;
}

export async function loader({ request }: DataFunctionArgs) {
  const user = await authenticateRoute(request);
  const hasWriteAccess = await isUserHasWriteAccess(user);
  const modelName = getAboutModelName();
  const model = getModelByModelName(modelName);

  try {
    const info = await getAboutInfo();
    const enrichedModel = await enrichModel(modelName, model);

    return json<LoaderData>({
      info,
      model: enrichedModel,
      modelName,
      hasWriteAccess,
    });
  } catch (e) {
    adminLogger.error(getErrorMessage(e));

    return redirect(adminApp.linkPath + modelName);
  }
}

export async function action({ request }: DataFunctionArgs) {
  await authenticateRoute(request);
  const { pathname } = new URL(request.url);
  const formData = await request.formData();
  const database = getAboutDatabase();
  const modelName = getAboutModelName();

  await mutateDatabaseByModelNameAndFormData(
    modelName,
    formData,
    database,
    aboutInfoKey,
  );

  return redirect(pathname);
}

export default function Editor(): JSX.Element | null {
  const { info, model, hasWriteAccess } = useLoaderData<LoaderData>();

  return (
    <EditorPage
      item={info}
      model={model}
      headerPrefix={"About"}
      readonly={!hasWriteAccess}
    />
  );
}

// Helpers

async function enrichModel(modelName: ModelName, model: Model): Promise<Model> {
  if (modelName === ModelName.About) {
    const keys = await getCareerKeys();

    if (model.type === "object") {
      // Add options to association property
      model.properties["currentCompany"] = {
        ...(model.properties["currentCompany"] || {}),
        type: "string",
        enum: ["", ...keys],
      };
    }
  }

  return model;
}
