import { Checkbox as AriaCheckbox, CheckboxProps } from 'react-aria-components'

type Props = {
  size?: 'm' | 'l'
} & CheckboxProps

export function Checkbox({size='m', children, ...props }: Props) {
  return (
    (
      <AriaCheckbox {...props}>
        {({ isIndeterminate }) => (
          //@ts-ignore
          <>
            <div className={'checkbox'+' '+size}>
              <svg viewBox="0 0 18 18" aria-hidden="true">
                {isIndeterminate
                  ? <rect x={1} y={7.5} width={15} height={3} />
                  : <polyline points="1 9 7 14 15 4" />}
              </svg>
            </div>
            {children}
          </>
        )}
      </AriaCheckbox>
    )
  )
}
