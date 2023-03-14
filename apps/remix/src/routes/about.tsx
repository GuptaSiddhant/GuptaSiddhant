import ResumeIcon from "remixicon-react/FileUserLineIcon";

import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";

import { aboutTexts } from "@gs/about";
import { ModelName } from "@gs/models";
import { getAboutInfo } from "@gs/models/about/index.server";
import type { AboutInfo } from "@gs/models/about/info";
import { getCareerSummaryItems } from "@gs/models/career/index.server";
import { getEducationSummaryItems } from "@gs/models/education/index.server";
import { getAuthUser } from "@gs/service/auth.server";
import { type SummaryItem, filterSortSummaryItems } from "@gs/summary";
import SummaryTimeline from "@gs/summary/SummaryTimeline";
import Hero from "@gs/ui/Hero";
import { ExternalLink } from "@gs/ui/Link";
import { Paragraph } from "@gs/ui/Text";
import { createMetaTitle } from "@gs/utils/meta";

interface LoaderData {
  isAuthenticated: boolean;
  aboutInfo: AboutInfo;
  items: SummaryItem[];
}

export const loader: LoaderFunction = async ({ request }) => {
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
};

export const meta: MetaFunction = () => ({ title: createMetaTitle("About") });

export default function About(): JSX.Element {
  const { items } = useLoaderData<LoaderData>();

  return (
    <>
      <AboutHero />

      <SummaryTimeline items={items} />
    </>
  );
}

function AboutHero(): JSX.Element | null {
  return (
    <Hero>
      <Hero.Header
        title="About me"
        subtitle={["Full-stack developer", "UI designer"].join(" | ")}
      />
      <Hero.Description>
        {aboutTexts.map((text, index) => (
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
