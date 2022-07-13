import { type UseNavigationLinksProps } from "@gs/navigation/useNavigationLinks"
import { type ThemeName } from "@gs/theme"

export interface RootLoaderData extends UseNavigationLinksProps {
  themeName: ThemeName
}
