import { useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";

import { type Model, type ModelName, getModelByModelName } from "@gs/models";
import type { Skills } from "@gs/models/about.server";
import {
  aboutSkillsKey,
  getAboutDatabase,
  getAboutSkills,
  getAboutSkillsModelName,
} from "@gs/models/about.server";
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
  skills?: Skills;
  model: Model;
  modelName: ModelName;
  hasWriteAccess: boolean;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticateRoute(request);
  const hasWriteAccess = await isUserHasWriteAccess(user);

  const modelName = getAboutSkillsModelName();
  const model = getModelByModelName(modelName);

  try {
    const skills = await getAboutSkills();

    return json<LoaderData>({ skills, model, modelName, hasWriteAccess });
  } catch (e) {
    adminLogger.error(getErrorMessage(e));

    return redirect(adminApp.linkPath + modelName);
  }
};

export const action: ActionFunction = async ({ request }) => {
  await authenticateRoute(request);
  const { pathname } = new URL(request.url);
  const formData = await request.formData();
  const database = getAboutDatabase();
  const modelName = getAboutSkillsModelName();

  await mutateDatabaseByModelNameAndFormData(
    modelName,
    formData,
    database,
    aboutSkillsKey,
  );

  return redirect(pathname);
};

export default function Editor(): JSX.Element | null {
  const { skills, model, hasWriteAccess } = useLoaderData<LoaderData>();

  return (
    <EditorPage
      item={skills}
      model={model}
      headerPrefix={"About"}
      readonly={!hasWriteAccess}
    />
  );
}
