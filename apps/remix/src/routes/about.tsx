import { Link, useLoaderData } from "@remix-run/react";
import { type DataFunctionArgs, json } from "@remix-run/server-runtime";
import ResumeIcon from "remixicon-react/FileUserLineIcon";

import { ModelName } from "@gs/models";
import type { AboutInfo } from "@gs/models/about-info.model";
import { getAboutInfo } from "@gs/models/about.server";
import { getCareerSummaryItems } from "@gs/models/career.server";
import { getEducationSummaryItems } from "@gs/models/education.server";
import { getAuthUser } from "@gs/service/auth.server";
import { type SummaryItem, filterSortSummaryItems } from "@gs/summary";
import SummaryTimeline from "@gs/summary/SummaryTimeline";
import Hero from "@gs/ui/Hero";
import { ExternalLink } from "@gs/ui/Link";
import { Paragraph } from "@gs/ui/Text";
import {
  type MetaArgs,
  type MetaDescriptors,
  createMetaTitle,
  extractMetaFromMetaMatches,
} from "@gs/utils/meta";

interface LoaderData {
  isAuthenticated: boolean;
  aboutInfo: AboutInfo;
  items: SummaryItem[];
}

export async function loader({ request }: DataFunctionArgs) {
  const { searchParams } = new URL(request.url);

  const isAuthenticated = Boolean(await getAuthUser(request));

  const [aboutInfo, careerList, educationList] = await Promise.all([
    getAboutInfo(),
    getCareerSummaryItems(),
    getEducationSummaryItems(),
  ]);

  const lifelineSelectedCategory = (searchParams.get("category")?.toString() ??
    "") as ModelName;

  const summaryItems =
    lifelineSelectedCategory === ModelName.Education
      ? educationList
      : lifelineSelectedCategory === ModelName.Career
      ? careerList
      : [...careerList, ...educationList];

  const items = filterSortSummaryItems(summaryItems);

  return json<LoaderData>({
    isAuthenticated,
    aboutInfo,
    items,
  });
}

export function meta({ matches }: MetaArgs<typeof loader>): MetaDescriptors {
  const rootMeta = extractMetaFromMetaMatches(matches, { exclude: ["title"] });

  return [{ title: createMetaTitle("About") }, ...rootMeta];
}

export default function About(): JSX.Element {
  const { items, aboutInfo } = useLoaderData<LoaderData>();

  return (
    <>
      <AboutHero bio={aboutInfo.bio?.split("\n")} />

      <SummaryTimeline items={items} />
    </>
  );
}

function AboutHero({ bio = [] }: { bio?: string[] }): JSX.Element | null {
  return (
    <Hero>
      <Hero.Header
        title="About me"
        subtitle={["Full-stack developer", "UI designer"].join(" | ")}
      />
      <Hero.Description>
        {bio.map((text, index) => (
          <Paragraph className="text-tertiary" key={index.toString()}>
            {text}
          </Paragraph>
        ))}

        <Paragraph className="flex gap-2 border-t border-divider pt-4 text-tertiary">
          <ExternalLink href="/resume.pdf" className="w-max gap-2 flex-center">
            <ResumeIcon />
            Download Resume
          </ExternalLink>
          <span>
            (or try the customisable{" "}
            <Link to="/resume" className="text-link">
              Resume builder
            </Link>
            ).
          </span>
        </Paragraph>
      </Hero.Description>
    </Hero>
  );
}
