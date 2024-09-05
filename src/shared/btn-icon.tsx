import { ReactElement } from "react"

type Props = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  content: ReactElement | string
  title?: string
  disabled?: boolean
  dataEnabled?: boolean
}

export const BtnIcon = (
  { onClick, content, title, disabled=false, dataEnabled=false }: Props
) => {
  
  return (
    <button
      className="btn-icon"
      onClick={onClick}
      type="button"
      title={title}
      disabled={disabled}
      data-enabled={dataEnabled}
    >
      {content}
    </button>
  )
}
