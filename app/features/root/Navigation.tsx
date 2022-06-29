import { NavLink } from "@remix-run/react"

import { isExternalLink } from "~/features/helpers"
import type { NavigationLinkProps } from "~/features/ui/Link"

export interface NavigationProps {
  links: Array<NavigationLinkProps>
}

export default function Navigation({
  links,
}: NavigationProps): JSX.Element | null {
  if (links.length === 0) return null

  const internalLinks = links.filter(
    (link) => link.to && !isExternalLink(link.to.toString()),
  )
  const externalLinks = links.filter(
    (link) => !link.to || isExternalLink(link.to.toString()),
  )

  return (
    <nav
      aria-label="Main navigation"
      className="flex items-center justify-between gap-6"
    >
      <ul className="flex items-center justify-start gap-6 text-lg text-secondary">
        {internalLinks.map(({ id, to, children }) => (
          <li key={id} className="select-none flex items-center ">
            <NavLink
              to={to!}
              prefetch="intent"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-primary"
                  : "hocus:text-primary hocus:underline underline-offset-8"
              }
            >
              {children}
            </NavLink>
          </li>
        ))}
      </ul>

      <ul className="flex items-center justify-end gap-4 text-lg text-secondary">
        {externalLinks.map(({ to, children, ...props }) => (
          <li key={props.id} className="select-none flex items-center ">
            {to ? (
              <a
                {...props}
                href={to?.toString()}
                title={props.id}
                target="_blank"
                rel="noreferrer"
              >
                {children}
              </a>
            ) : props.onClick ? (
              <button {...props} title={props.id}>
                {children}
              </button>
            ) : (
              children
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

// export default function Navigation(): JSX.Element {
//   const { isMobile } = useBreakpoints()

//   if (isMobile) {
//     return (
//       <Menu>
//         {({ isExpanded }) => (
//           <>
//             <MenuButton className="block sm:hidden">
//               {isExpanded ? (
//                 <CloseIcon aria-label="Close menu" />
//               ) : (
//                 <MenuIcon aria-label="Open menu" />
//               )}
//             </MenuButton>
//             <MenuList className="text-lg font-normal">
//               {navLinks.map(({ to, children }) => (
//                 <MenuLink key={to.toString()} href={to.toString()}>
//                   {children}
//                 </MenuLink>
//               ))}
//               {socialLinks.map(({ href, children }) => (
//                 <MenuLink key={href} href={href}>
//                   {children}
//                 </MenuLink>
//               ))}
//             </MenuList>
//           </>
//         )}
//       </Menu>
//     )
//   }

//   return (
//     <nav aria-label="Main navigation">
//       <ul className="hidden sm:flex text-lg font-normal gap-4 sm:gap-6 md:gap-8 items-center justify-end">
//         {navLinks.map(({ to, children }) => {
//           return (
//             <li key={to.toString()} className="select-none">
//               <NavLink
//                 to={to}
//                 prefetch="intent"
//                 data-custom-color
//                 className={({ isActive }) =>
//                   clsx(isActive ? "text-link-active font-bold" : "text-link")
//                 }
//               >
//                 {children}
//               </NavLink>
//             </li>
//           )
//         })}
//         {socialLinks.map(({ href, children }) => (
//           <li key={href}>
//             <ExternalLink href={href}>{children}</ExternalLink>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   )
// }
