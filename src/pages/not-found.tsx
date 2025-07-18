import { useAppStore } from '@app/app-store'
import { Navigate, useLocation } from 'react-router-dom'

export const NotFound = () => {
  const { startPage } = useAppStore()
  const { pathname } = useLocation()
  return <Navigate to={ startPage === pathname ? '/' : startPage} />
}
