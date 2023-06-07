import { useLoaderData } from "@remix-run/react";
import { type DataFunctionArgs, json } from "@remix-run/server-runtime";
import clsx from "clsx";
import PositiveIcon from "remixicon-react/CheckboxCircleFillIcon";
import NegativeIcon from "remixicon-react/CloseCircleFillIcon";

import { getAuthUser, isUserHasWriteAccess } from "@gs/service/auth.server";
import { H1, Paragraph } from "@gs/ui/Text";

import { createAdminMeta } from "./features/helpers";

interface LoaderData {
  hasWriteAccess: boolean;
}

export async function loader({ request }: DataFunctionArgs) {
  const user = await getAuthUser(request);
  const hasWriteAccess = await isUserHasWriteAccess(user);

  return json<LoaderData>({ hasWriteAccess });
}

export default function AdminIndex(): JSX.Element | null {
  const { hasWriteAccess } = useLoaderData<LoaderData>();

  return (
    <main className="hidden flex-col text-disabled sm:flex-center">
      <H1>GS Admin</H1>
      <Paragraph>Select an app to begin</Paragraph>
      <Paragraph
        className={clsx(
          "mt-4 flex items-center gap-2",
          hasWriteAccess ? "text-positive" : "text-negative",
        )}
      >
        Write-access
        {hasWriteAccess ? <PositiveIcon /> : <NegativeIcon />}
      </Paragraph>
    </main>
  );
}

export const meta = createAdminMeta();
