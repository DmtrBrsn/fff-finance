import { Button as RACButton, ButtonProps as RACButtonProps, ToggleButton as RACToggleButton, ToggleButtonProps as RACToggleButtonProps } from 'react-aria-components'

type ButtonProps = {
  variant?: 'primary' | 'danger',
  size?: 's' | 'm' | 'l'
} & RACButtonProps

export function Button(
  { variant = 'primary', size = 'm', ...props }: ButtonProps
) {
  return (
    <RACButton
      className={
        'react-aria-Button' + ' ' +
        variant + ' ' +
        size +
        (props.className ? ' ' + props.className : '')
      }
      {...props}
    >
      {props.children}
    </RACButton>
  )
}

type ToggleButtonProps = {
  variant?: 'primary' | 'danger',
  size?: 's' | 'm' | 'l'
} & RACToggleButtonProps

export function ToggleButton(
  { variant = 'primary', size = 'm', ...props }: ToggleButtonProps
) {
  return (
    <RACToggleButton
      className={
        'react-aria-Button' + ' ' +
        variant + ' ' +
        size +
        (props.className ? ' ' + props.className : '')
      }
      {...props}
    >
      {props.children}
    </RACToggleButton>
  )
}
