import { type UseNavigationLinksProps } from "~/features/navigation/useNavigationLinks"
import { type ThemeName } from "~/features/theme"

export interface RootLoaderData extends UseNavigationLinksProps {
  themeName: ThemeName
}
