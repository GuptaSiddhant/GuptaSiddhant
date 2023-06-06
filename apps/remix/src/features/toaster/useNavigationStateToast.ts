import { useEffect, useRef } from "react";

import { useNavigation } from "@remix-run/react";

import useToaster from ".";

export default function useNavigationStateToast(
  loadingTitle: string = "Loading...",
  submittingTitle: string = loadingTitle,
) {
  const { state } = useNavigation();
  const { addToast, dismissToast } = useToaster();
  const idRef = useRef<string>();
  const title: string = state === "submitting" ? submittingTitle : loadingTitle;

  useEffect(() => {
    if (state === "idle") {
      return dismissToast(idRef.current);
    }

    idRef.current = addToast({
      id: "state",
      persistent: true,
      title,
    });
  }, [state, title, addToast, dismissToast]);
}
