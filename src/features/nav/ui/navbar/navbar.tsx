import { IconCalendarEvent, IconCategory, IconList, IconListCheck, IconSettings } from '@tabler/icons-react'
import { ReactNode } from "react"
import { Link } from "react-aria-components"
import { useLocation } from "react-router-dom"
import './navbar.css'

export const AppNavbar = () => {
  const { pathname } = useLocation()
  const classFn = (to: string) => to === pathname ? ' react-aria-Link active' : ' react-aria-Link'
  return (
    <nav className={'app-nav'} >
      <NavLink to="/operations" classFn={classFn}>
        <NavItem>
          <IconList />
          <span className="text">Operations</span>
        </NavItem>
      </NavLink>
      <NavLink to="/plans" classFn={classFn}>
        <NavItem>
          <IconListCheck />
          <span className="text">Plans</span>
        </NavItem>
      </NavLink>
      <NavLink to="/planning" classFn={classFn}>
        <NavItem>
          <IconCalendarEvent />
          <span className="text">Planning</span>
        </NavItem>
      </NavLink>
      <NavLink to="/categories" classFn={classFn}>
        <NavItem>
          <IconCategory />
          <span className="text">Categories</span>
        </NavItem>
      </NavLink>
      <NavLink to="/settings" classFn={classFn}>
        <NavItem>
          <IconSettings />
          <span className="text">Settings</span>
        </NavItem>
      </NavLink>
    </nav>
  )
}

const NavLink = (
  { children, to, classFn }:
    { children: ReactNode, to: string, classFn: (to: string) => string }
) => {
  return (
    <Link href={to} className={classFn(to)}>
      {children}
    </Link>
  )
}

const NavItem = ({ children }: { children: ReactNode }) => {
  return <div className='app-nav-item'>{children}</div>
}
