import { FlCell } from '@shared/fl-list'
import { ButtonIcon, Checkbox } from '@shared/react-aria'
import { Spinner } from '@shared/spinner'
import { DeleteIcon } from '@shared/svg'
import { DateUtils } from '@shared/utils'
import { ReactNode } from 'react'
import { Category, getIncExpStr } from '@features/categories/lib'
import { useOperationsDelete } from '@features/operations/api'
import { Operation } from '@features/operations/lib'
import { EditOpBtn } from '../../operation-form'
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
      {getIncExpStr(cat)}
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

export const OpSectionControls = ({ op }: { op: Operation }) => {
  const { mutateAsync: deleteOp, isPending: deleting } = useOperationsDelete()
  const handleDeleteClick = () => deleteOp(op.id)
  return (
    <FlCell className="op-buttons">
      <EditOpBtn op={op} />
      <ButtonIcon onPress={handleDeleteClick}>
        {deleting ? <Spinner /> : <DeleteIcon />}
      </ButtonIcon>
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
