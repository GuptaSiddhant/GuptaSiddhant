import { type ModelName } from "@gs/models";
import { type LinkObject } from "@gs/types";

export interface SummaryItem {
  id: string;
  title: string;
  model: ModelName;

  subtitle?: string;
  description?: string;
  date?: string;
  icon?: string;
  cover?: string;
  coverHash?: string;
  tags?: string[];
  links?: LinkObject[];
  linkUrl?: string;
  duration?: string;
  association?: string;

  draft?: boolean;
  featured?: boolean;
}

export interface SummaryTimelineDivider {
  id: string;
  type: "year";
  children: React.ReactNode;
}
