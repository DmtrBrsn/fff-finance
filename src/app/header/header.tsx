import { useAuth } from "@features/auth"
import { NavLink } from "react-router-dom"

import './header.css'

export const Header = () => {
  const { currentUser } = useAuth()
  if (!currentUser) return <></>
  
  return (
    <header className="app-header">
      <nav className='app-nav'>
        <NavLink to="/">New operation</NavLink>
        <NavLink to="/operations">Operations</NavLink>
        <NavLink to="/planning">Planning</NavLink>
        <NavLink to="/categories">Categories</NavLink>
        <NavLink to="/settings">Settings</NavLink>
        <NavLink to="/user-settings">Account</NavLink>
      </nav >
    </header>
  )
}
