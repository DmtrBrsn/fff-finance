import { SettingsTile } from "./settings-tile"
import { Logout } from "./logout"
import { UpdateEmail } from "./update-email"
import { UpdatePassword } from "./update-password"
import { DeleteUser } from "./delete-user"

export const Settings = () => {

  return (
    <div className="settings-container">

      <SettingsTile>
        <Logout />
      </SettingsTile>

      <SettingsTile>
        <UpdateEmail/>
      </SettingsTile>

      <SettingsTile>
      <UpdatePassword/>
      </SettingsTile>

      <SettingsTile>
      <DeleteUser/>
      </SettingsTile>

    </div>
  )
}
