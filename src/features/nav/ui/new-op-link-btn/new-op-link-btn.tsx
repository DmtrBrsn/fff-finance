import { LinkButton } from '@shared/react-aria'
import { AddIcon } from '@shared/svg'
import './new-op-link-btn.css'

export const NewOpLinkBtn = () => {

  return (
    <LinkButton
      tooltip='New operation'
      className={'react-aria-Button add-op-btn-floating attention'}
      href='/'
    >
      <AddIcon/>
    </LinkButton>
  )
}
