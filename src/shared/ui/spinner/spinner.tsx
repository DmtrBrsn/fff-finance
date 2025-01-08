import './spinner.css'
type Props = {
  size?: 'l' | 'xl'
  staticWhite?: boolean
  justified?: boolean
}

export const Spinner = ({ size, staticWhite, justified}: Props) => {
  return (
    <div
      className={"spinner" + (size ? ' ' + size : '') + (staticWhite ? ' static-white' : '') + (justified ? ' justified' : '')}
    />
  )
}
