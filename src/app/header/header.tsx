import { useAuth } from "@features/auth/auth-context"
import { AppNav } from "@features/nav/ui"
import './header.css'

export const Header = () => {
  const { currentUser } = useAuth()
  if (!currentUser) return <></>
  
  return (
    <header className="app-header">
      <AppNav/>
    </header>
  )
}
