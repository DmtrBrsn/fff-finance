import { Category, CatUtils } from '@features/categories/lib'
import { useOperationsDelete } from '@features/operations/api'
import { Operation } from '@features/operations/lib'
import { DateUtils, isTouchDevice } from '@shared/lib/utils'
import { FlCell } from '@shared/ui/fl-list'
import { Checkbox, DialogCloseBtn, MenuButtonIcon, MenuItem } from '@shared/ui/react-aria'
import { ReactNode, useMemo, useState } from 'react'
import { Dialog, Modal } from 'react-aria-components'
import { useNavigate } from 'react-router-dom'
import { EditOperationForm } from '../../operation-form'
import { ConfirmDialog } from '@shared/ui/confirm-dialog'
import { useOpsListStore } from '../operations-list-store'
import './op-section-values.css'

const Label = ({ children }: { children: ReactNode }) => <span className='op-section-value-label'>{children}</span>

export const OpDateSectionValue = ({ val }: { val: Operation['date'] }) => {
  return (
    <FlCell className="op-section-value op-date">
      {DateUtils.isoStrToLocal(val)}
    </FlCell>
  )
}

export const OpSumSectionValue = ({ val }: { val: Operation['sum'] }) => {
  return (
    <FlCell className="op-section-value op-sum">
      {val.toLocaleString()}
    </FlCell>
  )
}

export const OpDescriptionSectionValue = ({ val }: { val: Operation['description'] }) => {
  return (
    <FlCell className="op-section-value op-description">
      {val}
    </FlCell>
  )
}

export const OpCatSectionValue = ({ cat }: { cat?: Category }) => {
  return (
    <FlCell className="op-section-value op-category">
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
  const { selected, setSelected } = useOpsListStore()
  const isSelected = selected.includes(op.id)
  const { mutateAsync: deleteOp, isPending: deleting } = useOperationsDelete()
  const [delConfirmOpen, setDelConfirmOpen] = useState(false)
  const isTouch = useMemo(() => isTouchDevice(), [])
  const navigate = useNavigate()

  const editBtnAction = () => {
    isTouch ? navigate(`/operations/${op.id}`) : setOpen(true)
  }
  const close = () => setOpen(false)

  const toggleSelect = () => {
    if (isSelected) {
      setSelected(selected.filter(id => id !== op.id))
    }
    else {
      setSelected([...selected, op.id])
    }
  }

  return (
    <FlCell className="op-menu-btn">
      <MenuButtonIcon>
        <MenuItem onAction={editBtnAction}>Edit</MenuItem>
        <MenuItem isDisabled={deleting} onAction={() => setDelConfirmOpen(true)}>Delete</MenuItem>
        <MenuItem onAction={toggleSelect}>{isSelected ? 'Deselect' : 'Select'}</MenuItem>
      </MenuButtonIcon>

      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <Dialog>
          <DialogCloseBtn close={close} />
          <EditOperationForm op={op} onSuccess={close} onCancel={close} />
        </Dialog>
      </Modal>

      <ConfirmDialog
        title="Delete operation?"
        isOpen={delConfirmOpen}
        setOpen={setDelConfirmOpen}
        onConfirm={() => deleteOp(op.id)}
      />
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
