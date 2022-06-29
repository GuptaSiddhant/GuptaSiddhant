import { type UseNavigationLinksProps } from "~/features/home/useNavigationLinks"
import { type ThemeName } from "~/features/theme"

export interface RootLoaderData extends UseNavigationLinksProps {
  themeName: ThemeName
}
