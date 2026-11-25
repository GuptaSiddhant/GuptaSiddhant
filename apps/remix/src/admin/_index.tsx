import { type LoaderFunctionArgs, data, useLoaderData } from "react-router";
import clsx from "clsx";
import {
  RiCheckboxCircleFill as PositiveIcon,
  RiCloseCircleFill as NegativeIcon,
} from "@remixicon/react";

import { getAuthUser, isUserHasWriteAccess } from "@gs/service/auth.server";
import { H1, Paragraph } from "@gs/ui/Text";

import { createAdminMeta } from "./features/helpers";

interface LoaderData {
  hasWriteAccess: boolean;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getAuthUser(request);
  const hasWriteAccess = await isUserHasWriteAccess(user);

  return data<LoaderData>({ hasWriteAccess });
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
