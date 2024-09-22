import { ButtonContext } from "react-aria-components"
import './button-group.css'

interface ButtonGroupProps {
  children?: React.ReactNode,
  isDisabled?: boolean
}

export function ButtonGroup({ children, isDisabled }: ButtonGroupProps) {
  return (
    <div className="button-group">
      <ButtonContext.Provider value={{isDisabled}}>
        {children}
      </ButtonContext.Provider>
    </div>
  )
}
