import { Link, useLoaderData, useRouteError } from "@remix-run/react";
import {
  type DataFunctionArgs,
  json,
  redirect,
} from "@remix-run/server-runtime";

import { EditIcon } from "@gs/icons";
import {
  type BlogPostProps,
  getBlogPost,
  getBlogPostCrossSell,
} from "@gs/models/blog.server";
import { getAuthUser } from "@gs/service/auth.server";
import type { SummaryItem } from "@gs/summary";
import SummarySlider from "@gs/summary/SummarySlider";
import Divider from "@gs/ui/Divider";
import { ErrorSection } from "@gs/ui/Error";
import Hero from "@gs/ui/Hero";
import Mdx from "@gs/ui/Mdx";
import Reader from "@gs/ui/Reader";
import ShareTray from "@gs/ui/ShareTray";
import TableOfContent, { type TocItem } from "@gs/ui/TableOfContent";
import Tags from "@gs/ui/Tags";
import { H2 } from "@gs/ui/Text";
import { getErrorMessage } from "@gs/utils/error";
import { extractTocFromMdx, transformContentToMdx } from "@gs/utils/mdx";
import {
  type MetaArgs,
  type MetaDescriptors,
  generateArticleMeta,
} from "@gs/utils/meta";

interface LoaderData {
  post: BlogPostProps;
  url: string;
  mdx?: string;
  toc?: TocItem[];
  crossSell: SummaryItem[];
  isAuthenticated: boolean;
}

export async function loader({ params, request }: DataFunctionArgs) {
  const id = params.id;
  if (!id) {
    throw new Error("Blog post id is required");
  }

  const isAuthenticated = Boolean(await getAuthUser(request));

  try {
    const { content, ...post } = await getBlogPost(id);
    if (!__IS_DEV__ && post.draft) {
      return redirect("/blog/");
    }

    const mdx = transformContentToMdx(content);
    const toc = extractTocFromMdx(mdx);
    const crossSell = await getBlogPostCrossSell(id);

    return json<LoaderData>({
      post,
      url: request.url,
      mdx,
      toc,
      crossSell,
      isAuthenticated,
    });
  } catch (e) {
    const message = getErrorMessage(e);
    const reason = __IS_DEV__ ? `Reason: ${message}` : "";
    throw new Error(`Failed to load blog post '${id}'. ${reason}`);
  }
}

export function meta({
  data,
  params,
  matches,
}: MetaArgs<typeof loader>): MetaDescriptors {
  return generateArticleMeta(data?.post, {
    url: data?.url,
    id: params.id,
    section: "Blog",
    matches,
  });
}

export default function BlogPostDetails(): JSX.Element {
  const {
    post,
    url,
    mdx,
    toc = [],
    crossSell,
    isAuthenticated,
  } = useLoaderData<LoaderData>();
  const { id, title, subtitle, description, cover, icon, tags = [] } = post;

  return (
    <>
      <Hero>
        <Hero.Header
          caption={{
            to: "/blog",
            label: "Blog",
            icon: "back",
          }}
          title={title}
          subtitle={subtitle}
        >
          {isAuthenticated ? (
            <Link
              to={`/admin/editor/blog/${id}`}
              className="w-max"
              title="Edit"
            >
              <EditIcon />
            </Link>
          ) : null}
        </Hero.Header>

        <Hero.Description description={description}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Tags.List tags={tags.sort()} className="justify-start" />
            <ShareTray url={url} title={title} text={subtitle} />
          </div>
        </Hero.Description>

        <Hero.Image src={cover} alt={title} icon={icon} />
      </Hero>

      <Reader id="main-content" leftColumn={<TableOfContent toc={toc} />}>
        <Mdx mdx={mdx} />
      </Reader>

      <Divider />

      <SummarySlider items={crossSell} crossSell>
        <H2>More like this</H2>
      </SummarySlider>
    </>
  );
}

export function ErrorBoundary() {
  return (
    <ErrorSection
      error={useRouteError()}
      caption="Error 404"
      title="Blog post not found"
    />
  );
}
