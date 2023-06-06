import { ErrorSection } from "@gs/ui/Error";
import { useRouteError } from "@remix-run/react";

export default function Error404(): JSX.Element | null {
  return (
    <ErrorSection
      caption={"Error 404"}
      title="Page not found"
      message="Oops! Looks like you tried to visit a page that does not exist."
      error={useRouteError()}
    />
  );
}
