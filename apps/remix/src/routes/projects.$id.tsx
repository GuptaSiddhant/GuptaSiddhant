import { Link, useLoaderData, useRouteError } from "@remix-run/react";
import { type LoaderArgs, json, redirect } from "@remix-run/server-runtime";

import { EditIcon } from "@gs/icons";
import { generateStructuredDataForProject } from "@gs/models/projects.model";
import {
  type ProjectProps,
  getProject,
  getProjectAssociationById,
  getProjectCrossSell,
} from "@gs/models/projects.server";
import { getAuthUser } from "@gs/service/auth.server";
import type { SummaryItem } from "@gs/summary";
import SummarySlider from "@gs/summary/SummarySlider";
import type { MetaArgs, MetaDescriptors } from "@gs/types";
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
import { generateArticleMeta } from "@gs/utils/meta";

interface LoaderData {
  project: ProjectProps;
  url: string;
  mdx?: string;
  toc?: TocItem[];
  crossSell: SummaryItem[];
  associationItem?: SummaryItem;
  isAuthenticated: boolean;
}

export async function loader({ params, request }: LoaderArgs) {
  const id = params.id;
  if (!id) {
    throw new Response("Project id is required", { status: 400 });
  }

  const isAuthenticated = Boolean(await getAuthUser(request));

  try {
    const { content, association, ...project } = await getProject(id);

    if (!__IS_DEV__ && project?.draft) {
      return redirect("/projects/");
    }

    const mdx = transformContentToMdx(content);
    const toc = extractTocFromMdx(mdx);
    const crossSell = await getProjectCrossSell(id);
    const associationItem = await getProjectAssociationById(association);

    return json<LoaderData>({
      project,
      url: request.url,
      mdx,
      toc,
      crossSell,
      associationItem,
      isAuthenticated,
    });
  } catch (e) {
    const message = getErrorMessage(e);
    const reason = __IS_DEV__ ? `Reason: ${message}` : "";
    throw new Error(`Failed to load project '${id}'. ${reason}`);
  }
}

export function meta({
  data,
  params,
  matches,
}: MetaArgs<typeof loader>): MetaDescriptors {
  return generateArticleMeta(data?.project, {
    url: data?.url,
    id: params.id,
    section: "Project",
    matches,
  });
}

export default function ProjectDetails(): JSX.Element {
  const {
    project,
    url,
    mdx,
    toc = [],
    crossSell,
    associationItem,
    isAuthenticated,
  } = useLoaderData<LoaderData>();
  const { id, title, subtitle, description, cover, icon, tags = [] } = project;

  return (
    <>
      <Hero>
        <Hero.Header
          caption={{
            to: "/projects",
            label: "Project",
            icon: "back",
          }}
          title={title}
          subtitle={subtitle}
        >
          {isAuthenticated ? (
            <Link
              to={`/admin/editor/projects/${id}`}
              className="w-max"
              title="Edit"
            >
              <EditIcon />
            </Link>
          ) : null}
          {associationItem?.icon ? (
            <Link
              to={associationItem.linkUrl || `/about/${associationItem.id}`}
              title={associationItem.subtitle || associationItem.title}
            >
              <img
                src={associationItem.icon}
                title={associationItem.subtitle}
                alt={associationItem.subtitle}
                className="h-8 w-8 rounded-sm bg-inverse object-contain"
                loading="eager"
              />
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
      title="Project not found"
    />
  );
}

export const handle = {
  structuredData: generateStructuredDataForProject,
};
