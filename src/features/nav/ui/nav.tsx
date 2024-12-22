import { AccountCircleIcon, CategoryIcon, ChecklistIcon, CreateIcon, SettingsIcon } from "@shared/svg"
import { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import './nav.css'

export const AppNav = () => {
  return (
    <>
      <AppNavFull />
      <AppNavCompact />
    </>
  )
}

const AppNavFull = () => {
  return (
    <nav className={'app-nav app-nav-full'}>
      <NavLink to="/"><NavItem><CreateIcon /> New</NavItem></NavLink>
      <NavLink to="/operations">Operations</NavLink>
      <NavLink to="/planning">Planning</NavLink>
      <NavLink to="/plans"><NavItem><ChecklistIcon /> Plans</NavItem></NavLink>
      <NavLink to="/categories"><NavItem><CategoryIcon /> Categories</NavItem></NavLink>
      <NavLink to="/settings"><NavItem><SettingsIcon /> Settings</NavItem></NavLink>
      <NavLink to="/user-settings"><NavItem><AccountCircleIcon /> Account</NavItem></NavLink>
    </nav>
  )
}

const AppNavCompact = () => {
  return (
    <nav className={'app-nav app-nav-compact'}>
      <NavLink to="/"><NavItem><CreateIcon /> New</NavItem></NavLink>
      <NavLink to="/operations">Operations</NavLink>
      <NavLink to="/planning">Planning</NavLink>
      <NavLink to="/plans"><NavItem><ChecklistIcon /></NavItem></NavLink>
      <NavLink to="/categories"><NavItem><CategoryIcon /></NavItem></NavLink>
      <NavLink to="/settings"><NavItem><SettingsIcon /></NavItem></NavLink>
      <NavLink to="/user-settings"><NavItem><AccountCircleIcon /></NavItem></NavLink>
    </nav>
  )
}

const NavItem = ({ children }: { children: ReactNode }) => {
  return <div className='flex-row gap-micro align-center'>{children}</div>
}
