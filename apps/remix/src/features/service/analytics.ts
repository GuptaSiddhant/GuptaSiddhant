import { useLocation } from "@remix-run/react";
import { getAnalytics, logEvent } from "firebase/analytics";
import { useEffect } from "react";

import { firebaseClientApp } from "@gs/firebase/init.client";

export function useLogPageViewEvent() {
  const { pathname } = useLocation();

  useEffect(() => {
    const analyticsInstance = getAnalytics(firebaseClientApp);

    logEvent(analyticsInstance, "page_view", { page_path: pathname });
  }, [pathname]);
}
