import { NavLink } from 'react-router-dom'
import { useAuth } from "../contexts/auth-context"

export const Nav = () => {
  const { currentUser } = useAuth()

  return (
    <nav className='app-nav'>
      {
        currentUser ?
          <>
            <NavLink to="/">New operation</NavLink>
            <NavLink to="/operations">Operations</NavLink>
            <NavLink to="/categories">Catigories</NavLink>
            <NavLink to="/settings">Settings</NavLink>
          </>
          :
          <></>
      }
    </nav >
  )
}
