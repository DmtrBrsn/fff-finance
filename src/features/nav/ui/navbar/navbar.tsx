import { CalendarMonth, CategoryIcon, ChecklistIcon, ListIcon, SettingsIcon } from "@shared/ui/svg"
import { ReactNode } from "react"
import { useLocation } from "react-router-dom"
import { Link } from "react-aria-components"
import './navbar.css'

export const AppNavbar = () => {
  const { pathname } = useLocation()
  const classFn = (to: string) => to === pathname ? ' react-aria-Link active' : ' react-aria-Link'
  return (
    <nav className={'app-nav'} >
      <NavLink to="/operations" classFn={classFn}>
        <NavItem>
          <ListIcon />
          <span className="text">Operations</span>
        </NavItem>
      </NavLink>
      <NavLink to="/plans" classFn={classFn}>
        <NavItem>
          <ChecklistIcon />
          <span className="text">Plans</span>
        </NavItem>
      </NavLink>
      <NavLink to="/planning" classFn={classFn}>
        <NavItem>
          <CalendarMonth />
          <span className="text">Planning</span>
        </NavItem>
      </NavLink>
      <NavLink to="/categories" classFn={classFn}>
        <NavItem>
          <CategoryIcon />
          <span className="text">Categories</span>
        </NavItem>
      </NavLink>
      <NavLink to="/settings" classFn={classFn}>
        <NavItem>
          <SettingsIcon />
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
