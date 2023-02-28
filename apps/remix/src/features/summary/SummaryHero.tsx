import { type ReactNode } from "react";

import Hero from "@gs/ui/Hero";

import SummaryFilterSortForm, {
  type SummaryFilterSortFormProps,
} from "./SummaryFilterSortForm";

export interface SummaryHeroProps extends SummaryFilterSortFormProps {
  children?: ReactNode;
  title: string;
  subtitle?: string;
}

export default function SummaryHero({
  children,
  title,
  subtitle,
  ...props
}: SummaryHeroProps): JSX.Element | null {
  return (
    <Hero>
      <Hero.Header title={title} subtitle={subtitle} />
      <Hero.Description>
        {children}
        <SummaryFilterSortForm {...props} />
      </Hero.Description>
    </Hero>
  );
}
