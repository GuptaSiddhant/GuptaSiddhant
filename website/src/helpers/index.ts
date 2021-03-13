import { ReactNode, KeyboardEventHandler } from "react";
import { Slide } from "./slidesTrigger";

export {};

export type ArrayElement<
  ArrayType extends readonly unknown[]
> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export interface PageContent {
  id: string;
  title: string;
  subtitle?: string;
  description?: string | ReactNode;
  slides?: Slide[];
  items?: PageContent[];
  path?: string;
}

export const onMouseKeyboardAction = (callback: () => void) => ({
  onClick: callback,
  onKeyDown: (({ key }) => {
    if (key === "Enter" || key === " ") callback();
  }) as KeyboardEventHandler,
});
