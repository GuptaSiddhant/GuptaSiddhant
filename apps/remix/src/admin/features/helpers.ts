import { useMatches } from "react-router";

import invariant from "@gs/utils/invariant";
import {
  type MetaArgs,
  type MetaDescriptors,
  extractEssentialMetaFromMetaMatches,
} from "@gs/utils/meta";

import type { AdminAppProps } from ".";
import type { AdminAppHandle } from "./types";

export function useAdminApp(): AdminAppProps {
  const matches = useMatches();
  const adminApp = matches
    .map(({ handle }) => handle as Partial<AdminAppHandle> | undefined)
    .find((handle) => handle && "adminApp" in handle)?.adminApp;
  invariant(adminApp, "No admin app found. Please add one to the admin route.");

  return adminApp;
}

export function createAdminMeta<LoaderData extends object = object>(
  title?: string | ((data: LoaderData | undefined) => string | undefined),
) {
  return (args: MetaArgs): MetaDescriptors => {
    const metaTitle = createAdminTitle(
      typeof title === "function"
        ? title(args.loaderData as LoaderData | undefined)
        : title,
    );
    const adminMeta =
      args.matches.find((m) => m.id === "admin/__root")?.meta || [];

    return [
      { title: metaTitle },
      ...adminMeta,
      ...extractEssentialMetaFromMetaMatches(args.matches),
    ];
  };
}

function createAdminTitle(title: string | undefined): string {
  const adminTitle = "GS Admin";

  if (!title) return adminTitle;

  return `${adminTitle} | ${title}`;
}
