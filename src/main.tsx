import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '@app/app'
// import { registerSW } from 'virtual:pwa-register'
// import { toast } from 'react-toastify'
import './app/styles/reset.css'
import './app/styles/root.css'
import './app/styles/colors.css'
import './app/styles/global.css'
import './app/styles/inputs-buttons.css'
import './app/styles/auth.css'

// registerSW({
//   onOfflineReady() {
//     toast('ready to work offline')
//   }
// })

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
