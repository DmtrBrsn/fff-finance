import { NavLink } from 'react-router-dom'
import { useAuth } from "../contexts/auth-context"

export const Nav = () => {
  const { currentUser } = useAuth()

  return (
    <nav className='app-nav'>
      {
        currentUser ?
          <>
            <NavLink to="/">Add transaction</NavLink>
            <NavLink to="/transactions">Transactions</NavLink>
            <NavLink to="/settings">Settings</NavLink>
          </>
          :
          <></>
      }
    </nav >
  )
}
