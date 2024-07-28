import { Nav } from "./nav"
import { NavLink } from "react-router-dom"
import { useAuth } from "@features/auth"
import { AccountCircleIcon } from "@shared/svg"
import './header.style.css'

export const Header = () => {
  const { currentUser } = useAuth()

  return (
    <header>
      <Nav />
      {currentUser &&
        <NavLink to="/user-settings">
          <span
            className="cur-user-icon svg-icon"
            title={currentUser.email ?? ''}
          >
            <AccountCircleIcon />
          </span>
        </NavLink>}
    </header>
  )
}
