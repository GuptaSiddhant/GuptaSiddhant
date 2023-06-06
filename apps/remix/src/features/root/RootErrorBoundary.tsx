import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

import CodeBlock from "@gs/ui/CodeBlock";
import { ErrorPage, getErrorResponseTitle } from "@gs/ui/Error";

import Document from "./Document";

export default function RootErrorBoundary() {
  const error = useRouteError();

  if (!error) return null;

  if (isRouteErrorResponse(error)) {
    return (
      <Document error>
        <ErrorPage
          caption={`Error ${error.status.toString()}`}
          title={getErrorResponseTitle(error)}
        >
          {error.data && <CodeBlock>{error.data}</CodeBlock>}
        </ErrorPage>
      </Document>
    );
  }

  if (error instanceof Error) {
    return (
      <Document error>
        <ErrorPage caption={error.name} message={error.message}>
          {error.stack && <CodeBlock>{error.stack}</CodeBlock>}
        </ErrorPage>
      </Document>
    );
  }

  return (
    <Document error>
      <ErrorPage caption="Unknown Error" message={error.toString()} />
    </Document>
  );
}
