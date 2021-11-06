import { useState, useEffect } from "react";
import { Trigger } from "@guptasiddhant/react-trigger";

export interface Slide {
  image: string;
}

export const defaultSlides: Slide[] = [
  { image: "/images/BE.jpg" },
  { image: "/images/delta.jpg" },
];

export const slidesTrigger = new Trigger<Slide[]>();

export const useSlides = (defaultSlides: Slide[] = []) => {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  slidesTrigger.useSubscribe(setSlides);
  return slides;
};

export const setSlides = slidesTrigger.publish;

export const clearSlides = () => slidesTrigger.publish(defaultSlides);

export const useSetSlidesEffect = (slides?: Slide[]) => {
  useEffect(() => slides && setSlides(slides), [slides]);
};

export default slidesTrigger;
