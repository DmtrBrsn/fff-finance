
import { SettingsSubSection } from './settings-section'
import { useAppStore, AppTheme } from '../../app/app-store'
import { RadioGroup } from './react-aria'
import { Radio } from 'react-aria-components'

export const AppThemeSelector = () => {
  const theme = useAppStore(state => state.theme)
  const setTheme = useAppStore(state => state.setTheme)

  return (
    <SettingsSubSection>
      <RadioGroup label='Theme' orientation='horizontal' value={theme} onChange={t => setTheme(t as AppTheme)}>
        <Radio value='auto'>Auto</Radio>
        <Radio value='light'>Light</Radio>
        <Radio value='dark'>Dark</Radio>
      </RadioGroup>
    </SettingsSubSection>
  )
}
