import React, { useState } from 'react'
import { updateRootThemeAttr } from '../../utils/style-utils';

export const AppThemeSwitcher = () => {
	
  const initialTheme = localStorage.getItem('appTheme')
  const [switcherValue, setSwitcherValue] = useState<string>(initialTheme ?? 'auto')
	
	function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newTheme = e.target.value
    setSwitcherValue(newTheme)
    updateRootThemeAttr(newTheme)
    localStorage.setItem('appTheme', newTheme)
	}
	
  return (
    <div className='settings-section-container'>
      <label>Theme:</label>
      <select value={switcherValue} onChange={handleChange}>
        <option value="auto">Auto</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  )
}
