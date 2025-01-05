import { useAuth } from "@features/auth/auth-context"
import { AppNav } from "@features/nav/ui"
import { useMemo } from "react"
import { isTouchDevice } from "@shared/lib/utils"
import './header.css'

export const Header = () => {
  const { currentUser } = useAuth()
  const isTouch = useMemo(() => isTouchDevice(), [])
  if (!currentUser) return <></>
  
  return (
    <header className={'app-header '+ (isTouch ? 'app-header-mobile' : 'app-header-desktop')}>
      <AppNav/>
    </header>
  )
}
