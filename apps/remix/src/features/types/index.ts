import type { CSSProperties, ReactNode } from "react";

import type { LinkProps, ShouldRevalidateFunction } from "@remix-run/react";
import type {
  V2_ServerRuntimeMetaArgs,
  V2_ServerRuntimeMetaDescriptor,
} from "@remix-run/server-runtime";

export type To = LinkProps["to"];

export interface BaseProps<TRef extends HTMLElement = HTMLElement> {
  id?: string;
  className?: string;
  style?: CSSProperties;
  elementRef?: React.Ref<TRef>;
  children?: ReactNode;
}

export interface LinkObject<T = LinkType> {
  url: string;
  title?: string;
  type?: T;
}

export type LinkType =
  | "homepage"
  | "other"
  | "github"
  | "linkedin"
  | "twitter"
  | "demo"
  | "blog"
  | "npm"
  | "prototype"
  | "design";

export type Gallery = Array<{ url: string; alt: string }>;

export type RemixSubmitFunctionTarget =
  | HTMLFormElement
  | HTMLButtonElement
  | HTMLInputElement
  | FormData
  | URLSearchParams
  | {
      [name: string]: string;
    }
  | null;

export type ShouldRevalidateFunctionArgs =
  Parameters<ShouldRevalidateFunction>[0];

export type MaybePromise<T> = T | Promise<T>;

export interface UniqueTag {
  value: string;
  occurrence: number;
}

export interface NavigationLinkProps {
  id: string;
  children: React.ReactNode;
  to?: To;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  download?: string;
  external?: boolean;
  shortcut?: string[];
}

export { V2_ServerRuntimeMetaArgs as MetaArgs };
export type MetaDescriptors = V2_ServerRuntimeMetaDescriptor[];
