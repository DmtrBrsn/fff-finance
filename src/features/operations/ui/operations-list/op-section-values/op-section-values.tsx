import { Category, CatUtils } from '@features/categories/lib'
import { useOperationsDelete } from '@features/operations/api'
import { Operation } from '@features/operations/lib'
import { ConditionalModal } from '@shared/conditional-modal'
import { FlCell } from '@shared/fl-list'
import { Checkbox, MenuButtonIcon, MenuItem } from '@shared/react-aria'
import { DateUtils } from '@shared/utils'
import { ReactNode, useState } from 'react'
import { EditOperationForm } from '../../operation-form'
import './op-section-values.css'

const Label = ({ children }: { children: ReactNode }) => <span className='op-section-value-label'>{children}</span>

export const OpDateSectionValue = ({ val }: { val: Operation['date'] }) => {
  return (
    <FlCell className="op-section-value op-date">
      {/* <Label>Date</Label> */}
      {DateUtils.isoStrToLocal(val)}
    </FlCell>
  )
}

export const OpSumSectionValue = ({ val }: { val: Operation['sum'] }) => {
  return (
    <FlCell className="op-section-value op-sum">
      {/* <Label>Sum</Label> */}
      {val.toLocaleString()}
    </FlCell>
  )
}

export const OpDescriptionSectionValue = ({ val }: { val: Operation['description'] }) => {
  return (
    <FlCell className="op-section-value op-description">
      {/* <Label>Description</Label> */}
      {val}
    </FlCell>
  )
}

export const OpCatSectionValue = ({ cat }: { cat?: Category }) => {
  return (
    <FlCell className="op-section-value op-category">
      {/* <Label>Category</Label> */}
      {cat === undefined ? 'No category found' : cat.name}
    </FlCell>
  )
}

export const OpIsIncomeSectionValue = ({ cat }: { cat?: Category }) => {
  return (
    <FlCell className="op-section-value op-is-income">
      {CatUtils.getIncExpStr(cat)}
    </FlCell>
  )
}

export const OpCreatedSectionValue = ({ val }: { val: Operation['created'] }) => {
  return (
    <FlCell className="op-section-value op-created">
      <Label>Created</Label>
      {DateUtils.isoStrToLocal(val)}
    </FlCell>
  )
}

export const OpMenuBtn = ({ op }: { op: Operation }) => {
  const [isOpen, setOpen] = useState(false)
  const { mutateAsync: deleteOp, isPending: deleting } = useOperationsDelete()

  return (
    <FlCell className="op-buttons">
      <MenuButtonIcon>
        <MenuItem onAction={() => setOpen(true)}>Edit</MenuItem>
        <MenuItem isDisabled={deleting} onAction={() => () => deleteOp(op.id)}>Delete</MenuItem>
      </MenuButtonIcon>

      <ConditionalModal
        isOpen={isOpen}
        setOpen={setOpen}
      >
        <EditOperationForm op={op}/>
      </ConditionalModal>
      </FlCell>
  )
}

export const OpCheckbox = (
  { isSelected, handleCheckboxChange }:
    { isSelected: boolean, handleCheckboxChange: (e: boolean) => void }) => {
  return (
    <FlCell className="op-checkbox">
      <Checkbox isSelected={isSelected} onChange={handleCheckboxChange} />
    </FlCell>
  )
}
