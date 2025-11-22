
import { getAuth } from "firebase/auth"
import { SettingsSubSection } from '../../../shared/ui'

export const UserData = () => {
  const { currentUser } = getAuth()
  if (currentUser == undefined) return <></>

  return (
    <SettingsSubSection>
      <label>User</label>
      <ul>
        <li>email: {currentUser.email}</li>
        <li>name: {currentUser.displayName}</li>
        {
          currentUser.metadata.creationTime != undefined &&
          <li>user created: {new Date(currentUser.metadata.creationTime).toLocaleString(navigator.language)}</li>
        }
        {
          currentUser.metadata.lastSignInTime != undefined &&
          <li>last sign in: {new Date(currentUser.metadata.lastSignInTime).toLocaleString(navigator.language)}</li>
        }
      </ul>
    </SettingsSubSection>
  )
}
