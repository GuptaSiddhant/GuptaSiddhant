import { useRef, useState } from "react";

import useSafeLayoutEffect from "./useSafeLayoutEffect";
import useStableCallback from "./useStableCallback";

export default function useFullscreen<T extends HTMLElement>() {
  const targetRef = useRef<T>(null);

  const [isFullscreenEnabled, setIsFullscreenEnabled] =
    useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useSafeLayoutEffect(() => {
    const fullscreenEnabled = Boolean(
      window.document.fullscreenEnabled ||
        window.document.webkitFullscreenEnabled ||
        window.document.mozFullScreenEnabled ||
        window.document.msFullscreenEnabled,
    );

    setIsFullscreenEnabled(fullscreenEnabled);
  }, []);

  const exitFullscreen = useStableCallback(() => {
    document.exitFullscreen?.();
    document.webkitCancelFullScreen?.();
    document.mozCancelFullScreen?.();
    document.msExitFullscreen?.();

    setIsFullscreen(false);
  });

  const enterFullscreen = useStableCallback(() => {
    const element = targetRef.current;
    if (!element) {
      return;
    }

    element.requestFullscreen?.();
    element.webkitRequestFullScreen?.();
    element.mozRequestFullScreen?.();
    element.msRequestFullScreen?.();

    setIsFullscreen(true);
  });

  const toggleFullscreen = useStableCallback(() => {
    if (document.fullscreenElement) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  });

  return {
    isFullscreen: isFullscreenEnabled && isFullscreen,
    isFullscreenEnabled,
    toggleFullscreen,
    exitFullscreen,
    targetRef,
  };
}

declare global {
  interface Document {
    webkitFullscreenEnabled?: boolean;
    mozFullScreenEnabled?: boolean;
    msFullscreenEnabled?: boolean;

    webkitCancelFullScreen?: Document["exitFullscreen"];
    webkitExitFullScreen?: Document["exitFullscreen"];
    mozCancelFullScreen?: Document["exitFullscreen"];
    msExitFullscreen?: Document["exitFullscreen"];
  }

  interface HTMLElement {
    webkitRequestFullScreen?: HTMLElement["requestFullscreen"];
    mozRequestFullScreen?: HTMLElement["requestFullscreen"];
    msRequestFullScreen?: HTMLElement["requestFullscreen"];
  }
}
