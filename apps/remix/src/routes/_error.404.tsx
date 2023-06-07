import { useRouteError } from "@remix-run/react";

import { ErrorSection } from "@gs/ui/Error";
import {
  type MetaArgs,
  type MetaDescriptors,
  createMetaTitle,
  extractEssentialMetaFromMetaMatches,
} from "@gs/utils/meta";

export function meta({ matches }: MetaArgs): MetaDescriptors {
  return [
    ...extractEssentialMetaFromMetaMatches(matches),
    { title: createMetaTitle("Error 404") },
  ];
}

export default function Error404(): JSX.Element | null {
  return (
    <ErrorSection
      caption="Error 404"
      title="Page not found"
      message="Oops! Looks like you tried to visit a page that does not exist."
      error={useRouteError()}
    />
  );
}
