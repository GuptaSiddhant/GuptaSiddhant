export interface TableOfContentProps {
  toc: TocItem[];
  highestLevel: number;
  activeId?: string;
  className?: string;
}

export interface TocItem {
  level: number;
  id: string;
  text: string;
  children: TocItem[];
}

export type TocListItemOptions = Pick<
  TableOfContentProps,
  "highestLevel" | "activeId"
>;

export interface TocListItemProps extends TocListItemOptions {
  tocItem: TocItem;
}
