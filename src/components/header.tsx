import { Nav } from "./nav"
import { useAuth } from "../contexts/auth-context"

export const Header = () => {
  const { currentUser } = useAuth()

  return (
    <header>
      <Nav />
      {currentUser && <span className="cur-user-email">{currentUser.email}</span>}
    </header>
  )
}
