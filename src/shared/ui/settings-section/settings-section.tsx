import { ReactNode } from "react"
import { Heading, Separator } from "react-aria-components"
import './settings-section.css'

export const SettingsSection = ({ children, title }: { children: ReactNode, title: string }) => {
  return (
    <div className="settings-section">
      <Heading>{title}</Heading>
      <Separator orientation="horizontal" />
      <div className="content">
        {children}
      </div>
    </div>
  )
}

export const SettingsSubSection = ({ children }: { children: ReactNode }) => {
  return (
    <div className="settings-sub-section">
      {children}
    </div>
  )
}
