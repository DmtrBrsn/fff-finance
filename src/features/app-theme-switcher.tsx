import { RadioGroup } from '@shared/react-aria'
import { updateRootThemeAttr } from '@shared/utils'
import { useState } from 'react'
import { Radio } from 'react-aria-components'

export const AppThemeSwitcher = () => {
	
  const initialTheme = localStorage.getItem('appTheme')
  const [switcherValue, setSwitcherValue] = useState<string>(initialTheme ?? 'auto')
	
	function handleChange(e: string) {
    const newTheme = e
    setSwitcherValue(newTheme)
    updateRootThemeAttr(newTheme)
    localStorage.setItem('appTheme', newTheme)
	}
	
  return (
    <div className='settings-section-container'>
      <RadioGroup label='Theme' orientation='horizontal' value={switcherValue} onChange={handleChange}>
        <Radio value='auto'>Auto</Radio>
        <Radio value='light'>Light</Radio>
        <Radio value='dark'>Dark</Radio>
      </RadioGroup>
    </div>
  )
}
