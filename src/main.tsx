import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/app-statics/app.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { registerSW } from 'virtual:pwa-register'
import { toast } from 'react-toastify'
import './styles/reset.css'
import './styles/root.css'
import './styles/colors.css'
import './styles/global.css'
import './styles/inputs-buttons.css'
import './styles/auth.css'

registerSW({
  onOfflineReady() {
    toast('ready to work offline')
  }
})

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
