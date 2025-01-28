import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '@app/app'
import { ErrorBoundary } from '@app/error-boundary'
import { ErrorPage } from '@pages/error-page'
// import { registerSW } from 'virtual:pwa-register'


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
    <ErrorBoundary fallbackComponent={ErrorPage}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider></ErrorBoundary>
  </React.StrictMode>
)
