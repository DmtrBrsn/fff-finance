import { ReactElement } from "react"

export const BtnIcon = ({ onClick, content }: {onClick:(event: React.MouseEvent<HTMLElement>)=>void, content: ReactElement | string}) => {
  
  return (
    <button
      className="btn-icon"
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  )
}