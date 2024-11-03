import { AppThemeSwitcher } from "@features/app-theme-switcher"
import { ExportCategories } from "@features/import-export/export-categories"
import { ExportOperations } from "@features/import-export/export-operations"
import { ImportCategories } from "@features/import-export/import-categories"
import { ImportOperations } from "@features/import-export/import-operations"
import { Button } from "@shared/react-aria"
import { Vibration } from "@shared/svg"
import { isTouchDevice } from "@shared/utils"
import { useMemo } from "react"

import { toast } from "react-toastify"

export const SettingsPage = () => {
  const isTouch = useMemo(() => isTouchDevice(), [])
  return (
    <main className="max-width-wrap align-start flex-row wrap gap-3 pad-2">
      <AppThemeSwitcher />
      <ImportCategories/>
      <ImportOperations/>
      <ExportCategories/>
      <ExportOperations />

      <Button onPress={()=>toast('Test...')}>Test toast</Button>
      <Button variant="danger" onPress={() => toast.error('Error!')}>Test error toast</Button>
      {isTouch && <VibroButton />}
      <p style={{fontSize: '1.2rem', padding: '1rem', background: 'yellow', color: 'magenta'}}>{isTouch ? 'touch device' : 'not touch device' }</p>
    </main>
  )
}


const VibroButton = () => {
  return (<Button size='l' onPress={()=>navigator.vibrate(300)}><Vibration/></Button>)
}
