import { type ThemeName } from "~/features/theme"

import { type UseNavigationLinksProps } from "./useNavigationLinks"

export interface RootLoaderData extends UseNavigationLinksProps {
  themeName: ThemeName
}
