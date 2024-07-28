import { Navigate } from 'react-router-dom'

export const NotFound = () => {
  // return <h1>Page not found</h1>
  return <Navigate to="/"/>
}
