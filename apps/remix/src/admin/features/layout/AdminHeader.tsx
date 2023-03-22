import { type ReactNode, useEffect, useRef } from "react";

import { Link } from "@remix-run/react";

import type { NavigationLinkProps } from "@gs/types";
import type { To } from "@gs/types";
import { AnchorLink } from "@gs/ui/Link";

export default function AdminHeader({
  children,
  actions,
  collapsed,
  icon,
  to,
}: {
  to?: To;
  children: ReactNode;
  actions?: NavigationLinkProps[];
  collapsed?: boolean;
  icon: ReactNode;
}): JSX.Element {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => ref.current?.focus(), []);

  if (collapsed) {
    return (
      <header className="flex h-full w-full flex-col gap-4">
        <Link
          to={to || "."}
          title={children?.toString() || "App"}
          className="h-12 w-full border-b border-divider bg-secondary flex-center"
          ref={ref}
        >
          {icon}
        </Link>
        <div
          id="admin-app-actions"
          className="flex flex-1 flex-col items-center gap-4 overflow-auto"
        >
          {actions?.map((props) => (
            <AdminAction key={props.id} {...props} />
          ))}
        </div>
        <Link
          to={to || "."}
          className="w-full rotate-180  py-4 flex-center"
          style={{ writingMode: "vertical-lr" }}
        >
          {children}
        </Link>
      </header>
    );
  }

  return (
    <header className="sticky top-0 grid min-h-[3rem] grid-cols-[1fr_max-content] items-center gap-2 border-b border-divider bg-secondary px-4">
      <Link
        className="flex items-center gap-4 overflow-hidden text-ellipsis whitespace-nowrap"
        to={to || "."}
        ref={ref}
      >
        {children}
      </Link>
      <div className="flex items-center gap-4">
        {actions?.map((props) => (
          <AdminAction key={props.id} {...props} />
        ))}
      </div>
    </header>
  );
}

function AdminAction({
  id,
  to,
  children,
  external,
  ...props
}: NavigationLinkProps): JSX.Element | null {
  if (props.onClick) {
    return (
      <button
        type="button"
        title={id}
        className="underline-offset-8 hocus:text-primary hocus:underline"
        {...props}
      >
        {children}
      </button>
    );
  }

  if (to) {
    return (
      <AnchorLink
        {...props}
        href={to.toString()}
        title={id}
        target={external ? "_blank" : "_self"}
      >
        {children}
      </AnchorLink>
    );
  }

  return <>{children}</>;
}
