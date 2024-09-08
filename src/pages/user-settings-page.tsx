import { Logout, UnlinkGoogle, SignInWithGoogle, UnlinkEmailAndPassword, UpdateEmail, UpdatePassword, DeleteUser } from "@features/auth"
import { UserData } from "@features/user-data"
import { getAuth } from "firebase/auth"

export const UserSettingsPage = () => {
  const { currentUser } = getAuth()
  const providers = currentUser?.providerData
  const userLoggedInUsingEmailAndPass = !!providers?.some(prov => prov.providerId === 'password')
  const userLoggedInUsingGoogle = !!providers?.some(prov => prov.providerId === 'google.com')

  return (
    <main className="settings-container">
      <UserData/>
      <Logout />
      {userLoggedInUsingGoogle ? <UnlinkGoogle /> : <SignInWithGoogle/>}
      {userLoggedInUsingEmailAndPass ? <UnlinkEmailAndPassword /> : <></>}
      {userLoggedInUsingEmailAndPass ? (
        <>
          <UpdateEmail/>
          <UpdatePassword/>
        </>)
        :
        <></>
      }
      <DeleteUser />
    </main>
  )
}
