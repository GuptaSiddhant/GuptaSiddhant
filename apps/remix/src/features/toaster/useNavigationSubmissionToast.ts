import { useEffect, useMemo } from "react";

import { useNavigation } from "@remix-run/react";

import useToaster from "@gs/toaster";

import { type ToastProps } from "./Toast";

export type SubmissionMethodType = "PUT" | "POST" | "DELETE" | "PATCH" | "GET";
export type NavigationSubmissionToastTitles = Record<
  SubmissionMethodType,
  undefined | string | Omit<ToastProps, "id">
>;

export default function useNavigationSubmissionToast(
  titles: Partial<NavigationSubmissionToastTitles>,
) {
  const { addToast, dismissToast } = useToaster();
  const { formMethod } = useNavigation();

  const id = "submission";
  const toast = formMethod
    ? titles[formMethod.toUpperCase() as SubmissionMethodType]
    : undefined;

  const newToast: ToastProps | undefined = useMemo(() => {
    if (typeof toast === "object") {
      return { id, persistent: true, ...toast };
    }
    const title = toast;
    if (title) {
      return { id, title, persistent: true };
    }
    return undefined;
  }, [toast]);

  useEffect(() => {
    if (!formMethod) {
      dismissToast(id);
      return;
    }
    if (newToast) {
      addToast(newToast);
    }
  }, [formMethod, newToast, addToast, dismissToast]);
}
