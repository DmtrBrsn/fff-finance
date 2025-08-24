import { useState } from 'react'
import {
  FieldError,
  Input,
  Label,
  Text,
  TextField as AriaTextField,
  TextFieldProps as AriaTextFieldProps,
  ValidationResult,
  TextArea,
  Group
} from 'react-aria-components'
import { ButtonIcon } from '../button-icon/button-icon'
import { IconEye, IconEyeClosed } from '@tabler/icons-react'

interface BaseTextFieldProps extends AriaTextFieldProps {
  label?: string
  description?: string
  errorMessage?: string | ((validation: ValidationResult) => string)
  placeholder?: string
}

interface TextFieldProps extends BaseTextFieldProps {
  fontSize?: 'm' | 'l' | 'xl'
  size?: number
  passwordPeekBtn?: boolean
  justified?: boolean
}

interface TextAreaFieldProps extends BaseTextFieldProps {
  rows?: number,
  resize?: 'none' | 'both' | 'horizontal' | 'vertical',
}

export const TextField = (props: TextFieldProps) => {
  const [passwordShown, setPasswordShown] = useState(false)

  return (
    (
      <AriaTextField className={
        'react-aria-TextField' +
        (props.justified ? ' justified' : '')
      } {...props}>
        <Label>{props.label}</Label>
        {props.type === 'password' ?
          <Group className={
            'react-aria-Group' +
            (props.type === 'password' &&
              (props.passwordPeekBtn == undefined || props.passwordPeekBtn) ? ' password-input-with-peek-btn' : '')
          }>
            <Input
              className={'react-aria-Input' + ' ' + (props.fontSize ?? 'm')}
              value={props.value}
              size={props.size}
              placeholder={props.placeholder}
              type={props.type === 'password' && passwordShown ? 'text' : props.type}
            />
            {props.type === 'password' &&
              (props.passwordPeekBtn == undefined || props.passwordPeekBtn) &&
              <span className='password-input-peek-btn'>
                <ButtonIcon
                  onPress={() => setPasswordShown(!passwordShown)}
                  size='s'
                  isDisabled={props.isDisabled}
                >
                  {passwordShown ? <IconEye /> : <IconEyeClosed />}
                </ButtonIcon></span>
            }
          </Group>
          :
          <Input
            className={'react-aria-Input' + ' ' + (props.fontSize ?? 'm')}
            size={props.size}
            value={props.value}
            placeholder={props.placeholder}
          />
        }
        {props.description && <Text slot="description">{props.description}</Text>}
        <FieldError>{props.errorMessage}</FieldError>
      </AriaTextField>
    )
  )
}

export function TextAreaField(
  { label, description, errorMessage, rows = 4, resize = 'none', ...props }: TextAreaFieldProps
) {
  return (
    (
      <AriaTextField {...props}>
        <Label>{label}</Label>
        <TextArea
          placeholder={props.placeholder}
          rows={rows}
          className={'react-aria-TextArea' + ' ' + resize}
        />
        {description && <Text slot="description">{description}</Text>}
        <FieldError>{errorMessage}</FieldError>
      </AriaTextField>
    )
  )
}