import { Link, useLoaderData } from "@remix-run/react";
import type { ErrorBoundaryComponent } from "@remix-run/server-runtime";
import {
  type LoaderFunction,
  type MetaFunction,
  json,
  redirect,
} from "@remix-run/server-runtime";

import {
  extractTocFromMdx,
  transformContentToMdx,
} from "@gs/helpers/mdx.server";
import { generateArticleMeta } from "@gs/helpers/meta";
import { type TocItem } from "@gs/helpers/table-of-contents";
import Hero from "@gs/hero";
import { EditIcon } from "@gs/icons";
import {
  type ProjectProps,
  getProject,
  getProjectAssociationById,
  getProjectCrossSell,
} from "@gs/models/projects/index.server";
import { getAuthUser } from "@gs/service/auth.server";
import type { SummaryItem } from "@gs/summary";
import SummarySlider from "@gs/summary/SummarySlider";
import Divider from "@gs/ui/Divider";
import { ErrorSection } from "@gs/ui/Error";
import Mdx from "@gs/ui/Mdx";
import Reader from "@gs/ui/Reader";
import ShareTray from "@gs/ui/ShareTray";
import TableOfContent from "@gs/ui/TableOfContent";
import Tags from "@gs/ui/Tags";
import { H2 } from "@gs/ui/Text";
import { generateStructuredDataForProject } from "@gs/models/projects";

interface LoaderData {
  project: ProjectProps;
  url: string;
  mdx?: string;
  toc?: TocItem[];
  crossSell: SummaryItem[];
  associationItem?: SummaryItem;
  isAuthenticated: boolean;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = params.id;
  if (!id) {
    throw new Error("Project id is required");
  }

  const isAuthenticated = Boolean(await getAuthUser(request));

  try {
    const { content, association, ...project } = await getProject(id);

    if (!__IS_DEV__ && project.draft) {
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
  } catch (e: any) {
    const reason = __IS_DEV__ ? `Reason: ${e?.message}` : "";
    throw new Error(`Failed to load project '${id}'. ${reason}`);
  }
};

export const meta: MetaFunction = ({ data, params }) =>
  generateArticleMeta(data?.project, {
    url: data?.url,
    id: params.id,
    section: "Project",
  });

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
            <ShareTray url={url} />
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

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <ErrorSection caption="Error 404" title="Project not found" error={error} />
  );
};

export const handle = {
  structuredData: generateStructuredDataForProject,
};
