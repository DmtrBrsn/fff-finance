i
import { i } from 'motion/react-client'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../app/app-store'

export const NotFound = () => {
  const startPage = useAppStore(state => state.startPage)
  const { pathname } = useLocation()
  return <Navigate to={startPage === pathname ? '/' : startPage} />
}
