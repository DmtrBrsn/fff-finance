import { toast } from "@app/toaster"
import { AppThemeSwitcher } from "@features/app-theme-switcher"
import { ExportMenu } from "@features/import-export"
import { ImportCategories } from "@features/import-export/import-categories"
import { ImportOperations } from "@features/import-export/import-operations"
import { Button } from "@shared/react-aria"
import { Vibration } from "@shared/svg"
import { isTouchDevice } from "@shared/utils"
import { useMemo } from "react"

export const SettingsPage = () => {
  const isTouch = useMemo(() => isTouchDevice(), [])
  return (
    <main className="max-width-wrap align-start align-baseline flex-row wrap gap-3 pad-2">
      <AppThemeSwitcher />
      <ImportCategories />
      <ImportOperations />
      <ExportMenu />

      <Button onPress={() => toast('Info toast example', 'Log', () => console.log('test'))}>My toast info</Button>
      <Button onPress={() => toast.error('Error toast example', 'Log', () => console.log('test'))}>My toast error</Button>
      <Button onPress={() => toast.success('Success toast example', 'Log', () => console.log('test'))}>My toast success</Button>
      <Button onPress={() => toast.warning('Warning toast example', 'Log', () => console.log('test'))}>My toast warning</Button>

      {isTouch && <VibroButton />}
      <p style={{ fontSize: '1.2rem', padding: '1rem', background: 'yellow', color: 'magenta' }}>{isTouch ? 'touch device' : 'not touch device'}</p>
    </main>
  )
}


const VibroButton = () => {
  return (<Button size='l' onPress={() => navigator.vibrate(300)}><Vibration /></Button>)
}
