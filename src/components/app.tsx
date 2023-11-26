import { Header } from './header'
import { Router } from './router'
import { AuthProvider } from '../contexts/auth-context'

function App() {

  return (
    <AuthProvider>
      <Header />
        <Router/>
    </AuthProvider>
  )
}

export default App
