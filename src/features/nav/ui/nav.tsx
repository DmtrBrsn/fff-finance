import { CalendarMonth, CategoryIcon, ChecklistIcon, ListIcon, SettingsIcon } from "@shared/ui/svg"
import { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import './nav.css'

export const AppNav = () => {
  return (
    <nav className={'app-nav'}>
      {/* <NavLink to="/">
        <NavItem><CreateIcon />New</NavItem>
      </NavLink> */}
      <NavLink to="/operations">
        <NavItem><ListIcon/>Operations</NavItem>
      </NavLink>
      <NavLink to="/plans">
        <NavItem><ChecklistIcon />Plans</NavItem>
      </NavLink>
      <NavLink to="/planning">
        <NavItem><CalendarMonth/>Planning</NavItem>
      </NavLink>
      <NavLink to="/categories">
        <NavItem><CategoryIcon />Categories</NavItem>
      </NavLink>
      <NavLink to="/settings">
        <NavItem><SettingsIcon />Settings</NavItem>
      </NavLink>
    </nav>
  )
}

const NavItem = ({ children }: { children: ReactNode }) => {
  return <div className='app-nav-item'>{children}</div>
}
