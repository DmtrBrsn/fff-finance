import { ReactNode } from 'react'
import {useLongPress} from 'react-aria';
import './fl-list.css'

type FlProps = { children: ReactNode | ReactNode[], className?: string }
type FlRowProps = {
  children: ReactNode | ReactNode[]
  selected?: boolean
  active?: boolean
  className?: string,
  onLongPress?: () => void
}
type FlCellProps = {
  children: ReactNode,
  center?: boolean
  className?: string
  style?: React.CSSProperties
}

export const FlList = ({ children, className }: FlProps) => {
  return (
    <div className={'fl-list' + (className ? ' ' + className : '')}>
      {children}
    </div>
  )
}

export const FlRow = ({ children, onLongPress, selected = false, active = false, className }: FlRowProps) => {
  let { longPressProps } = useLongPress({
    onLongPress: onLongPress ?? undefined
  })
  return (
    <div
      {...longPressProps}
      tabIndex={1}
      className={
        'fl-list-row' +
        (selected ? ' ' + 'fl-row-selected' : '') +
        (className ? ' ' + className : '') +
        (active ? ' ' + 'fl-row-active' : '')
      }>
      {children}
    </div>
  )
}

export const FlTitle = ({ children, className }: FlProps) => {
  return (
    <div className={'fl-list-title' + (className ? ' ' + className : '')}>
      {children}
    </div>
  )
}

export const FlBody = ({ children, className }: FlProps) => {
  return (
    <div className={'fl-list-body custom-scrollbar' + (className ? ' ' + className : '')}>
      {children}
    </div>
  )
}

export const FlHeader = ({ children, className }: FlProps) => {
  return (
    <div className={'fl-list-header' + (className ? ' ' + className : '')}>
      {children}
    </div>
  )
}

export const FlCell = (
  { children,
    center,
    className,
    style,
  }: FlCellProps
) => {
  return (
    <span
      style={style}
      className={
        'fl-cell' +
        (center ? ' ' + 'fl-center' : '') +
        (className ? ' ' + className : '')
      }
    >
      {children}
    </span>
  )
}

export const FlNoData = ({ children }: FlProps) => {
  return (
    <div className={
      'fl-cell' + 
      ' ' + 'center' + 
      ' ' + 'fl-no-data'
    }>
      {children}
    </div>
  )
}
