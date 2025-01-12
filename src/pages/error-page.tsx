import { useAppStore } from "@app/app-store"
import { LinkButton } from "@shared/ui"

export const ErrorPage = () => {
  const { startPage } = useAppStore()
  return (
    <main className="flex-col align-center justify-center">
      <h1>Error</h1>
      <p>Something went wrong</p>
      <LinkButton href={startPage}>Go to start page</LinkButton>
    </main>
  )
}
