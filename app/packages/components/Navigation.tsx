import { NavLink } from "@remix-run/react"
import type { ReactNode } from "react"
import type { To } from "react-router"

import { isExternalLink } from "~/packages/helpers"

export interface NavigationProps {
  links: Array<NavigationLinkProps>
}

export interface NavigationLinkProps {
  id: string
  children: ReactNode
  to?: To
  onClick?: () => void
}

export default function Navigation({
  links,
}: NavigationProps): JSX.Element | null {
  if (links.length === 0) return null

  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center justify-end gap-6 text-lg text-secondary">
        {links.map((linkProps) => (
          <li key={linkProps.id} className="select-none flex items-center">
            {linkProps.to ? (
              <NavigationLink {...linkProps} />
            ) : (
              <button {...linkProps} title={linkProps.id} />
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

function NavigationLink({
  to,
  children,
  ...props
}: NavigationLinkProps): JSX.Element | null {
  if (isExternalLink(to?.toString() || "")) {
    return (
      <a
        {...props}
        href={to?.toString()}
        title={props.id}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    )
  }

  return to ? (
    <NavLink
      to={to}
      prefetch="intent"
      className={({ isActive }) =>
        isActive ? "font-bold text-primary" : "hover:text-primary"
      }
    >
      {children}
    </NavLink>
  ) : null
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
