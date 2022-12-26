/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

declare module "react-overdrive" {
  export interface OverdriveProps {
    id: string;
    children: React.ReactElement;
    duration?: number;
    easing?: string;
    element?: keyof JSX.IntrinsicElements;
    animationDelay?: number;
    onAnimationEnd?: () => void;
    style?: React.CSSProperties;
    // rest
    className?: string;
    ref?: React.Ref<any>;
    onClick?: () => void;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    CACHE_TTL: string;
  }
}
