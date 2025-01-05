import { useAppStore } from '@app/app-store'
import { Navigate } from 'react-router-dom'

export const NotFound = () => {
  const {startPage} = useAppStore()
  // return <h1>Page not found</h1>
  return <Navigate to={startPage} />
}
