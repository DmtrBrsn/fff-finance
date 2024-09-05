import { ReactNode } from 'react'
import './fl-list.style.css'

type FlProps = { children: ReactNode | ReactNode[], className?: string }
type FlRowProps = {
  children: ReactNode | ReactNode[]
  selected?: boolean
  active?: boolean
  className?: string
}
type FlCellProps = {
  children: ReactNode,
  center?: boolean
  className?: string
}

export const FlList = ({ children, className }: FlProps) => {
  return (
    <div className={'fl-list' + (className ? ' ' + className : '')}>
      {children}
    </div>
  )
}

export const FlRow = ({ children, selected=false, active=false, className }: FlRowProps) => {
  return (
    <div
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
    className
  }: FlCellProps
) => {
  return (
    <span
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
