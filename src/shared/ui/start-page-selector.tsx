import { StartPage, useAppStore } from "@app/app-store"
import { RadioGroup } from "./react-aria"
import { Radio } from "react-aria-components"

export const StartPageSelector = () => {
  const { startPage, setStartPage } = useAppStore()
  
  return (
    <div className='settings-section-container'>
      <RadioGroup
        label='Start page'
        orientation='vertical'
        value={startPage}
        onChange={p => setStartPage(p as StartPage)}>
        <Radio value='/operations/new'>New operation</Radio>
        <Radio value='/operations'>Operations</Radio>
        <Radio value='/planning'>Planning</Radio>
      </RadioGroup>
    </div>
  )
}
