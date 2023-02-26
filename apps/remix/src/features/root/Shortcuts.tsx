import { useNavigate } from "@remix-run/react";

import useEventListener from "@gs/hooks/useEventListener";
import useShortcutsCallback, {
  ShortcutModifier,
} from "@gs/hooks/useShortcutsCallback";
import useNavigationLinks from "@gs/root/useNavigationLinks";
import { useSearch } from "@gs/search";
import { useToggleTheme } from "@gs/theme/ThemeToggleButton";
import type { NavigationLinkProps } from "@gs/types";

export default function Shortcuts(): JSX.Element | null {
  const navigate = useNavigate();
  const links = useNavigationLinks();
  const toggleTheme = useToggleTheme();
  const { openSearchWithInput } = useSearch();

  const shortcuts: Partial<NavigationLinkProps>[] = [
    ...links,
    {
      id: "commands",
      onClick: () => openSearchWithInput(">"),
      shortcut: [ShortcutModifier.META, ShortcutModifier.SHIFT, "P"],
    },
    {
      id: "theme",
      onClick: toggleTheme,
      shortcut: [ShortcutModifier.SHIFT, "D"],
    },
    {
      id: "Admin",
      onClick: () => navigate("/admin"),
      shortcut: [ShortcutModifier.SHIFT, "Q"],
    },
  ];

  const callback = useShortcutsCallback(shortcuts);
  useEventListener("keydown", callback);

  return null;
}
