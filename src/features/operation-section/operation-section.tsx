import { useCategoriesGet } from "@entities/categories"
import { Operation, useOperationsDelete } from "@entities/operations"
import { EditIcon, DeleteIcon, RepeatIcon } from "@shared/svg"
import { FlCell, FlRow } from "@shared/fl-list"
import { DateUtils } from "@shared/utils"
import { ButtonIcon, Checkbox } from "@shared/react-aria"
import { Dialog, DialogTrigger, Modal } from "react-aria-components"
import { EditOperationForm } from "@features/edit-operation-form"
import { Spinner } from "@shared/spinner"

import '../operation-section/operation-section.css'

export const OperationSection = ({ op }: {op: Operation}) => {
  const { data: cats } = useCategoriesGet(false)
  const cat = cats?.find(c => c.id === op.idCategory)
  const {mutateAsync: deleteOp, isPending: deleting } = useOperationsDelete()
  const handleDeleteClick = () => deleteOp(op.id)

  return (
    <FlRow className={cat?.isIncome ? 'income-background' : ''}>
      <FlCell className="op-date">{DateUtils.isoStrToLocal(op.date)}</FlCell>
      <FlCell className="op-sum">{op.sum.toLocaleString()}</FlCell>
      <FlCell className="op-description">{op.description}</FlCell>
      <FlCell className="op-category">{cat===undefined ? 'No category found' : cat.name}</FlCell>
      <FlCell className="op-is-income">{cat===undefined ? '' : cat.isIncome ? 'Income' : 'Expense'}</FlCell>
      <FlCell className="op-is-plan"><Checkbox isSelected={op.isPlan} isDisabled aria-label="Is plan" /></FlCell>
      <FlCell className="op-date">{DateUtils.isoStrToLocal(op.created)}</FlCell>
      <FlCell className="op-buttons">
        <DialogTrigger>
          <ButtonIcon><EditIcon/></ButtonIcon>
          <Modal>
            <Dialog>
              {({ close }) => (
                <EditOperationForm op={op} onSuccess={close} onCancel={close}/>
              )}
            </Dialog>
          </Modal>
        </DialogTrigger>
        <ButtonIcon
          onPress={handleDeleteClick}
        >
          {deleting ? <Spinner/> :<DeleteIcon />}
        </ButtonIcon>
      </FlCell>
      {op.idRecurrent && <span className="op-recurrent-badge"><RepeatIcon/></span>}
    </FlRow>
  )
}
