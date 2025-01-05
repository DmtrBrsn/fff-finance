import React from 'react'
import {ButtonContext} from 'react-aria-components'
type ButtonGroupProps = {
  orientation?: 'horizontal' | 'vertical'
  children?: React.ReactNode
  isDisabled?: boolean
}
export function ButtonGroup({ children, isDisabled, orientation='horizontal' }: ButtonGroupProps) {
  return (
    <div className={"react-aria-Group-buttons" + ' '+ orientation}>
      <ButtonContext.Provider value={{isDisabled}}>
        {children}
      </ButtonContext.Provider>
    </div>
  )
}
