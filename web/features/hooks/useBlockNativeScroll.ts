import useSafeLayoutEffect from "./useSafeLayoutEffect"

export default function useBlockNativeScroll(disabled?: boolean) {
  return useSafeLayoutEffect(() => {
    if (!disabled) {
      window.document.body.style.overflow = "hidden"
    }

    return () => {
      window.document.body.style.overflow = "initial"
    }
  }, [disabled])
}
