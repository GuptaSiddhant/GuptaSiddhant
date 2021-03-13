import { useState, useRef, useEffect } from "react";

export interface ScrollShadow {
  top: boolean;
  bottom: boolean;
}

const useScrollShadow = () => {
  const ref = useRef<HTMLElement>(null);
  const [isScrollingTop, setScrollingTop] = useState(false);
  const [isScrollingBottom, setScrollingBottom] = useState(false);

  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      const { scrollHeight, clientHeight } = el;
      const maxScrollPos = scrollHeight - clientHeight - 8;
      setScrollingTop(scrollPos > 0);
      setScrollingBottom(
        scrollHeight > clientHeight && scrollPos < maxScrollPos
      );
    }
  }, [scrollPos]);

  useEffect(() => {
    const el = ref.current;
    const handleScroll = () => setScrollPos(el?.scrollTop || 0);
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, []);

  return { ref, isScrollingTop, isScrollingBottom };
};

export default useScrollShadow;
