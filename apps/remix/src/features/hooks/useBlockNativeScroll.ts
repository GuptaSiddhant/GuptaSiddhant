import useSafeLayoutEffect from "./useSafeLayoutEffect";

export default function useBlockNativeScroll(disabled?: boolean) {
  return useSafeLayoutEffect(() => {
    const currentBodyOverflowStyle = window.document.body.style.overflow;

    if (!disabled) {
      window.document.body.style.overflow = "hidden";
    }

    return () => {
      window.document.body.style.overflow = currentBodyOverflowStyle;
    };
  }, [disabled]);
}
