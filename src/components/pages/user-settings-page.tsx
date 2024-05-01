import { Logout } from "../auth/logout"
import { UpdateEmail } from "../auth/update-email"
import { UpdatePassword } from "../auth/update-password"
import { DeleteUser } from "../auth/delete-user"
import { getAuth } from "firebase/auth"
import { UnlinkGoogle } from "../auth/unlink-google"
import { UnlinkEmailAndPassword } from "../auth/unlink-email-and-password"
import { SignInWithGoogle } from "../auth/sign-in-with-google"

export const UserSettingsPage = () => {
  const { currentUser } = getAuth()
  const providers = currentUser?.providerData
  const userLoggedInUsingEmailAndPass = !!providers?.some(prov => prov.providerId === 'password')
  const userLoggedInUsingGoogle = !!providers?.some(prov => prov.providerId === 'google.com')

  return (
    <main className="settings-container">
      <h1>{ currentUser?.email }</h1>
      <Logout />
      {userLoggedInUsingGoogle ? <UnlinkGoogle /> : <SignInWithGoogle/>}
      {(userLoggedInUsingEmailAndPass && (providers && providers.length > 0)) ? <UnlinkEmailAndPassword /> : <></>}
      {(providers && providers.length === 0) ? (
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
