import { useMatches } from "@remix-run/react";

import invariant from "@gs/utils/invariant";
import {
  type MetaArgs,
  type MetaDescriptors,
  extractEssentialMetaFromMetaMatches,
} from "@gs/utils/meta";

import type { AdminAppProps } from ".";

export function useAdminApp(): AdminAppProps {
  const matches = useMatches();
  const adminApp = matches.find(({ handle }) => handle && "adminApp" in handle)
    ?.handle?.adminApp;
  invariant(adminApp, "No admin app found. Please add one to the admin route.");

  return adminApp;
}

export function createAdminMeta<LoaderData extends object = object>(
  title?: string | ((data: LoaderData | undefined) => string | undefined),
) {
  return (args: MetaArgs): MetaDescriptors => {
    const metaTitle = createAdminTitle(
      typeof title === "function" ? title(args.data) : title,
    );
    const adminMeta = args.matches.find((m) => m.id === "admin")?.meta || [];

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
