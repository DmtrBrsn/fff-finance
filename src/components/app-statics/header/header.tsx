import { Nav } from "./nav"
import { useAuth } from "../auth-context"
import { AccountCircleIcon } from "../../common/svg"
import { NavLink } from "react-router-dom"
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
