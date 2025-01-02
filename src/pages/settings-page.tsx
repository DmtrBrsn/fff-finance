import { DeleteUser, Logout, SignInWithGoogle, UnlinkEmailAndPassword, UnlinkGoogle, UpdateEmail, UpdatePassword, UserData } from "@features/auth/ui"
import { ExportMenu } from "@features/import-export"
import { ImportCategories } from "@features/import-export/import-categories"
import { ImportOperations } from "@features/import-export/import-operations"
import { toast } from "@features/toaster"
import { AppThemeSwitcher } from "@shared/app-theme-switcher"
import { Button, Disclosure } from "@shared/react-aria"
import { Vibration } from "@shared/svg"
import { isTouchDevice } from "@shared/utils"
import { getAuth } from "firebase/auth"
import { useMemo } from "react"

export const SettingsPage = () => {
  const { currentUser } = getAuth()
  const providers = currentUser?.providerData
  const userLoggedInUsingEmailAndPass = !!providers?.some(prov => prov.providerId === 'password')
  const userLoggedInUsingGoogle = !!providers?.some(prov => prov.providerId === 'google.com')

  return (
    <main className="max-width-wrap align-start align-baseline flex-row wrap gap-3 pad-2">
      <AppThemeSwitcher />
      <ImportCategories />
      <ImportOperations />
      <ExportMenu />
      <UserData />
      <Logout />
      {userLoggedInUsingGoogle ? <UnlinkGoogle /> : <SignInWithGoogle />}
      {userLoggedInUsingEmailAndPass ? <UnlinkEmailAndPassword /> : <></>}
      {userLoggedInUsingEmailAndPass ? (
        <>
          <UpdateEmail />
          <UpdatePassword />
        </>)
        :
        <></>
      }
      <DeleteUser />


      <Testing />
    </main>
  )
}

const Testing = () => {
  const isTouch = useMemo(() => isTouchDevice(), [])
  return (
    <Disclosure title="testing">
      <div className="flex-col gap-1">
        <Button onPress={() => toast('Info toast example', 'Log', () => console.log('test'))}>My toast info</Button>
        <Button onPress={() => toast.error('Error toast example', 'Log', () => console.log('test'))}>My toast error</Button>
        <Button onPress={() => toast.success('Success toast example', 'Log', () => console.log('test'))}>My toast success</Button>
        <Button onPress={() => toast.warning('Warning toast example', 'Log', () => console.log('test'))}>My toast warning</Button>

        {isTouch && <VibroButton />}
        <p style={{ fontSize: '1.2rem', padding: '1rem', background: 'yellow', color: 'magenta' }}>{isTouch ? 'touch device' : 'not touch device'}</p></div>
    </Disclosure>
  )
}


const VibroButton = () => {
  return (<Button size='l' onPress={() => navigator.vibrate(300)}><Vibration /></Button>)
}
