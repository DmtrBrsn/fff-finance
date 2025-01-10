import { CalendarMonth, CategoryIcon, ChecklistIcon, ListIcon, SettingsIcon } from "@shared/ui/svg"
import { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import './navbar.css'

export const AppNavbar = () => {
  return (
    <nav className={'app-nav'}>
      <NavLink to="/operations">
        <NavItem>
          <ListIcon />
          <span className="text">Operations</span>
        </NavItem>
      </NavLink>
      <NavLink to="/plans">
        <NavItem>
          <ChecklistIcon />
          <span className="text">Plans</span>
        </NavItem>
      </NavLink>
      <NavLink to="/planning">
        <NavItem>
          <CalendarMonth />
          <span className="text">Planning</span>
        </NavItem>
      </NavLink>
      <NavLink to="/categories">
        <NavItem>
          <CategoryIcon />
          <span className="text">Categories</span>
        </NavItem>
      </NavLink>
      <NavLink to="/settings">
        <NavItem>
          <SettingsIcon />
          <span className="text">Settings</span>
        </NavItem>
      </NavLink>
    </nav>
  )
}

const NavItem = ({ children }: { children: ReactNode }) => {
  return <div className='app-nav-item'>{children}</div>
}
