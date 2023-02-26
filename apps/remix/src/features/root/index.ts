import { type UseNavigationLinksProps } from "@gs/root/useNavigationLinks";
import { type ThemeName } from "@gs/theme";

export interface RootLoaderData extends UseNavigationLinksProps {
  themeName: ThemeName;
  locale: string;
  isPwa: boolean;
}
