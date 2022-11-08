import clsx from "clsx";
import { useMemo } from "react";
import TocIcon from "remixicon-react/FileListLineIcon";

import { Link } from "@remix-run/react";

import {
  type TocItem,
  arrangeTocByLevels,
  useCurrentActiveId,
} from "@gs/helpers/table-of-contents";
import { fabBottomLeftClassName } from "@gs/ui/Button";
import Menu, { type MenuActionProps } from "@gs/ui/Menu";

const TOC_LEVEL_GAP = 8;

export default function TableOfContent({ toc = [] }: { toc: TocItem[] }) {
  const activeId = useCurrentActiveId(toc);

  if (toc.length === 0) {
    return null;
  }

  const arrangedToc = toc.reduce(arrangeTocByLevels, []);
  const tocHighestLevel = arrangedToc[0]?.level || 1;

  return (
    <>
      <InlineTableOfContent
        toc={arrangedToc}
        highestLevel={tocHighestLevel}
        activeId={activeId}
        className="hidden px-8 lg:block"
      />

      <FloatingTableOfContent
        toc={toc}
        highestLevel={tocHighestLevel}
        className="lg:hidden"
        activeId={activeId}
      />
    </>
  );
}

export interface TableOfContentProps {
  toc: TocItem[];
  highestLevel: number;
  activeId?: string;
  className?: string;
}

// Floating

export function FloatingTableOfContent({
  toc,
  highestLevel,
  className,
  activeId,
}: TableOfContentProps): JSX.Element | null {
  const actions: MenuActionProps[] | undefined = useMemo(
    () =>
      toc?.map(({ id, text, level }) => {
        const isActive = activeId?.toLowerCase() === id.toLowerCase();

        return {
          id,
          children: (
            <span
              style={{
                paddingLeft: (level - highestLevel) * TOC_LEVEL_GAP,
                fontWeight: isActive ? "bold" : "normal",
              }}
            >
              {text}
            </span>
          ),
          to: `#${id}`,
        };
      }),
    [toc, highestLevel, activeId],
  );

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <Menu actions={actions} className={clsx(className, fabBottomLeftClassName)}>
      <TocIcon aria-label="Table of contents" />
    </Menu>
  );
}

// Inline

export function InlineTableOfContent({
  toc,
  className,
  ...options
}: TableOfContentProps): JSX.Element {
  return (
    <nav className={clsx(className, "list-none")}>
      {toc.map((item) => (
        <TocListItem key={item.id} tocItem={item} {...options} />
      ))}
    </nav>
  );
}

type TocListItemOptions = Pick<
  TableOfContentProps,
  "highestLevel" | "activeId"
>;

interface TocListItemProps extends TocListItemOptions {
  tocItem: TocItem;
}

function TocListItem(props: TocListItemProps): JSX.Element | null {
  const { id, children, level } = props.tocItem;

  return (
    <li
      key={id}
      className={clsx("relative my-2", level > props.highestLevel && "ml-4")}
    >
      {children.length === 0 ? (
        <TocListLeafItem key={id} {...props} />
      ) : (
        <TocListAccordion key={id} {...props} />
      )}
    </li>
  );
}

function TocListAccordion({
  tocItem: { id, children, text },
  ...options
}: TocListItemProps): JSX.Element | null {
  return (
    <details open>
      <summary className="-indent-4">
        <TocItemLink id={id} activeId={options.activeId} text={text} />
      </summary>
      <InlineTableOfContent toc={children} {...options} />
    </details>
  );
}

function TocListLeafItem({ tocItem, ...options }: TocListItemProps) {
  return (
    <span
      className={clsx(
        "text-tertiary before:absolute before:-indent-4 before:content-['•']",
      )}
    >
      <TocItemLink {...tocItem} activeId={options.activeId} />
    </span>
  );
}

function TocItemLink({
  id,
  activeId,
  text,
}: {
  id: string;
  activeId?: string;
  text: string;
}): JSX.Element | null {
  const isActive = activeId?.toLowerCase() === id.toLowerCase();

  return (
    <Link
      replace
      to={`#${id}`}
      className={clsx(
        isActive ? "font-bold text-primary" : "text-tertiary",
        "hover:text-default",
      )}
    >
      {text}
    </Link>
  );
}
