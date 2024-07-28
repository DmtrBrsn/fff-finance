import { ReactElement } from "react"

export const BtnIcon = ({ onClick, content, title }: {onClick?:(event: React.MouseEvent<HTMLElement>)=>void, content: ReactElement | string, title?:string}) => {
  
  return (
    <button
      className="btn-icon"
      onClick={onClick}
      type="button"
      title={title}
    >
      {content}
    </button>
  )
}
