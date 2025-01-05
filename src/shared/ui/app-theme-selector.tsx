import { AppTheme, useAppStore } from '@app/app-store'
import { RadioGroup } from '@shared/ui/react-aria'
import { Radio } from 'react-aria-components'

export const AppThemeSelector = () => {
  const {theme, setTheme} = useAppStore()

  return (
    <div className='settings-section-container'>
      <RadioGroup label='Theme' orientation='horizontal' value={theme} onChange={t=>setTheme(t as AppTheme)}>
        <Radio value='auto'>Auto</Radio>
        <Radio value='light'>Light</Radio>
        <Radio value='dark'>Dark</Radio>
      </RadioGroup>
    </div>
  )
}
