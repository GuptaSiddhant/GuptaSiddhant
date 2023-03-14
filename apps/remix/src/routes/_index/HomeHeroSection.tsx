import { type AboutInfo } from "@gs/models/about-info.model";
import type { CareerProps } from "@gs/models/career";
import CodeBlock from "@gs/ui/CodeBlock";
import Hero from "@gs/ui/Hero";
import { ExternalLink, InternalLink } from "@gs/ui/Link";
import { H1 } from "@gs/ui/Text";
import { formatList } from "@gs/utils/format";
import { useEffect, useState } from "react";

export default function HomeHeroSection({
  about,
  currentCompany,
}: {
  about: AboutInfo;
  currentCompany?: CareerProps;
}): JSX.Element {
  const { title, terminalResume, techStack = [], hero } = about;
  const { title: heroTitle, adjectives = [] } = hero;

  const parsedHeroTitle = heroTitle.split(/{{(.*?)}}/);

  return (
    <Hero prose>
      <H1>
        {parsedHeroTitle.map((text) =>
          text === "adjectives" ? (
            <ChangingText key={text} texts={adjectives} />
          ) : text === "techStack" ? (
            <ChangingText key={text} texts={techStack} />
          ) : (
            text
          ),
        )}
      </H1>
      <div className="flex flex-col gap-4">
        <p>
          I am a <strong>{title}</strong> with a drive for creating beautiful
          web and mobile apps with {formatList(techStack)}.
        </p>
        <CurrentCompany career={currentCompany} />
        <InternalLink to="/about" prefetch="intent">
          Read more about me.
        </InternalLink>
      </div>

      <CodeBlock copyText={terminalResume.copyText} wrap>
        {terminalResume.code}
      </CodeBlock>
    </Hero>
  );
}

function CurrentCompany({
  career,
}: {
  career?: CareerProps;
}): JSX.Element | null {
  if (!career?.company) {
    return null;
  }

  const { company, links } = career;
  const link = links?.find(({ type }) => type === "homepage")?.url;
  const hiringLink = links?.find(
    ({ type, title }) =>
      type === "other" &&
      (title?.toLowerCase().includes("hire") ||
        title?.toLowerCase().includes("hiring")),
  );

  return (
    <p>
      Currently applying my skills at{" "}
      <ExternalLink enableIcon href={link}>
        <strong>{company}</strong>
      </ExternalLink>
      {hiringLink ? (
        <>
          {" ("}
          <ExternalLink href={hiringLink.url} enableIcon>
            {hiringLink.title || "we are hiring"}
          </ExternalLink>
          {")"}
        </>
      ) : null}
      .
    </p>
  );
}

function ChangingText({
  texts,
  duration = 4000,
}: {
  texts: string[];
  duration?: number;
}): JSX.Element {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % texts.length);
    }, duration);

    return () => {
      clearInterval(interval);
    };
  }, [texts, duration]);

  return (
    <span className="inline-block animate-appear-btt" key={index}>
      {texts[index]}
    </span>
  );
}
