import { blogQuery } from "../helpers/queries";
import DateLine from "../components/DateLine";
import Page from "../components/Page";
import {
  ItemBox,
  ItemTitle,
  ItemSubTitle,
  ItemDescription,
} from "../components/Item";
import type { PageItemProps, PartialPageProps, BlogType } from "../types";

export default function Blog(props: PartialPageProps<BlogType>): JSX.Element {
  return <Page limit={props.limit} query={blogQuery} Item={BlogItem} />;
}

function BlogItem({
  item: project,
  selected,
}: PageItemProps<BlogType>): JSX.Element {
  const { slug, title, content, date, tags = [] } = project;

  return (
    <ItemBox key={slug.current}>
      <ItemTitle selected={selected}>{title}</ItemTitle>
      <ItemSubTitle selected={selected}>{date}</ItemSubTitle>
      {/* <ItemDescription selected={selected}>{tags.join(", ")}</ItemDescription> */}
      <ItemDescription selected={selected}>
        {/* {JSON.stringify(content, null, 2)} */}
        {(content as any)?.[0]?.children?.[0]?.text || ""}
      </ItemDescription>
    </ItemBox>
  );
}
