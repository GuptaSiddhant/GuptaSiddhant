import useSafeLayoutEffect from "./useSafeLayoutEffect"

export default function useBlockNativeScroll() {
  return useSafeLayoutEffect(() => {
    window.document.body.style.overflow = "hidden"

    return () => {
      window.document.body.style.overflow = "initial"
    }
  }, [])
}
