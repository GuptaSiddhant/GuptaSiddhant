import type { MetaFunction } from "@remix-run/server-runtime";

import { ErrorSection } from "@gs/ui/Error";
import { createMetaTitle } from "@gs/utils/meta";

export const meta: MetaFunction = () => ({
  title: createMetaTitle("Error 404"),
});

export default function Error404(): JSX.Element | null {
  return (
    <ErrorSection
      caption="Error 404"
      title="Page not found"
      message="Oops! Looks like you tried to visit a page that does not exist."
    />
  );
}
