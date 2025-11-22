
import { IconRefresh } from '@tabler/icons-react'
import { useAppStore } from '../app/app-store'
import { Button, LinkButton } from '../shared/ui'

export const ErrorPage = (
  { error, resetErrorBoundary }:
    { error: Error | null, resetErrorBoundary: () => void }
) => {
  const startPage = useAppStore(state => state.startPage)
  return (
    <main className="flex-col align-center justify-center full-height" >
      <h1>An error occurred</h1>
      <p>{error?.name ?? ''} {error?.message ?? ''}</p>
      <span className='flex-row gap-2'>
        <Button onPress={resetErrorBoundary} size='l'><IconRefresh />Reset error</Button>
        <LinkButton size='l' href={startPage}><IconRefresh />Go to start page</LinkButton>
      </span>
    </main >
  )
}
