import { DeleteUser, Logout, SignInWithGoogle, UnlinkEmailAndPassword, UnlinkGoogle, UpdateEmail, UpdatePassword, UserData } from "@features/auth/ui"
import { ExportMenu } from "@features/import-export"
import { ImportCategories } from "@features/import-export/import-categories"
import { ImportOperations } from "@features/import-export/import-operations"
import { toast } from "@features/toaster"
import { isTouchDevice, setMetaThemeColor } from "@shared/lib/utils"
import { SettingsSection, StartPageSelector } from "@shared/ui"
import { AppThemeSelector } from "@shared/ui/app-theme-selector"
import { Button, Disclosure, ToggleButton } from "@shared/ui/react-aria"
import { Vibration } from "@shared/ui/svg"
import { getAuth } from "firebase/auth"
import { useMemo, useState } from "react"

export const SettingsPage = () => {
  const { currentUser } = getAuth()
  const providers = currentUser?.providerData
  const userLoggedInUsingEmailAndPass = !!providers?.some(prov => prov.providerId === 'password')
  const userLoggedInUsingGoogle = !!providers?.some(prov => prov.providerId === 'google.com')

  return (
    <main>
      <SettingsSection title='App'>
        <AppThemeSelector />
        <StartPageSelector />
      </SettingsSection>
      <SettingsSection title='Account'>
        <UserData />
        <Logout />
        {userLoggedInUsingGoogle ? <UnlinkGoogle /> : <SignInWithGoogle />}
        {userLoggedInUsingEmailAndPass ? <UnlinkEmailAndPassword /> : <></>}
        <DeleteUser />
        {userLoggedInUsingEmailAndPass ? (
          <>
            <UpdateEmail />
            <UpdatePassword />
          </>)
          :
          <></>
        }
      </SettingsSection>
      <SettingsSection title='Import/export'>
        <ImportCategories />
        <ImportOperations />
        <ExportMenu />
      </SettingsSection>
      <SettingsSection title='Testing'>
        <Testing />
      </SettingsSection>
    </main>
  )
}

const Testing = () => {
  const isTouch = useMemo(() => isTouchDevice(), [])
  const [pending, setPending] = useState(false)
  const [color, setColor] = useState<string | undefined>(undefined)
  return (
    <Disclosure title="testing">
      <Button onPress={() => toast('Info toast example', 'Log', () => console.log('test'))}>My toast info</Button>
      <Button onPress={() => toast.error('Error toast example', 'Log', () => console.log('test'))}>My toast error</Button>
      <Button onPress={() => toast.success('Success toast example', 'Log', () => console.log('test'))}>My toast success</Button>
      <Button onPress={() => toast.warning('Warning toast example', 'Log', () => console.log('test'))}>My toast warning</Button>

      {isTouch && <VibroButton />}
      <p style={{ fontSize: '1.2rem', padding: '1rem', background: 'yellow', color: 'magenta' }}>{isTouch ? 'touch device' : 'not touch device'}</p>


      <Button isPending={pending}>{pending ? 'Pending' : 'Not pending'}</Button>
      <ToggleButton isSelected={pending} onChange={setPending}>Toggle pending</ToggleButton>

      <span className="flex-row gap-1 pad-1"><input type='color' value={color} onChange={(e) => setColor(e.target.value)}></input>
        <Button onPress={() => color && setMetaThemeColor(color)}>set theme color</Button></span>
      <Button onPress={() => document.querySelector('meta[name="theme-color"]')?.remove()} >remove theme color</Button>
    </Disclosure>
  )
}


const VibroButton = () => {
  return (<Button size='l' onPress={() => navigator.vibrate(300)}><Vibration /></Button>)
}
