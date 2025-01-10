import { StartPage, useAppStore } from "@app/app-store"
import { RadioGroup } from "./react-aria"
import { Radio } from "react-aria-components"
import { SettingsSubSection } from "./settings-section"

export const StartPageSelector = () => {
  const { startPage, setStartPage } = useAppStore()
  
  return (
    <SettingsSubSection>
      <RadioGroup
        label='Start page'
        orientation='vertical'
        value={startPage}
        onChange={p => setStartPage(p as StartPage)}>
        <Radio value='/operations/new'>New operation</Radio>
        <Radio value='/operations'>Operations</Radio>
        <Radio value='/planning'>Planning</Radio>
      </RadioGroup>
    </SettingsSubSection>
  )
}
