
type Props = { children?: React.ReactNode }
export const SettingsTile = ({ children }:Props)=> {
  return (
    <div className="settings-tile">
      {children}
    </div>
  )
}
