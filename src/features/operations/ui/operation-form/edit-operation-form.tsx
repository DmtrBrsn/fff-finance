import { CategorySelectField } from "@features/categories/ui/fields-for-category"
import { useOperationsUpdate } from "@features/operations/api"
import { Operation, OperationUpd } from "@features/operations/lib"
import { toast } from "@features/toaster"
import { Button } from "@shared/ui/react-aria"
import { Spinner } from "@shared/ui/spinner/spinner"
import { IconRestore } from '@tabler/icons-react'
import { FormEvent, useState } from "react"
import { Form } from "react-aria-components"
import { OpDateField, OpDescriptionField, OpSumField } from "./operation-fields"

type EditOperationFormProps = {
  op: Operation
  onSuccess?: () => void
  onCancel?: () => void
}

export const EditOperationForm = ({ op, onSuccess, onCancel }: EditOperationFormProps) => {
  const [updOp, setUpdOp] = useState<OperationUpd>({ id: op.id })
  const { mutateAsync: update, isPending: isSaving } = useOperationsUpdate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (Object.keys(updOp).length === 1) {
      onSuccess && onSuccess()
      return
    }
    await update(updOp)
    toast('Operation updated')
    onSuccess && onSuccess()
  }
  const reset = () => setUpdOp(op)

  return (
    <Form onSubmit={handleSubmit} className="react-aria-Form edit-operation-form">
      <OpDateField date={updOp.date ?? op.date} onChange={(date) => setUpdOp({ ...updOp, date })} />
      <OpSumField autofocus={false} sum={updOp.sum ?? op.sum} onChange={(sum) => setUpdOp({ ...updOp, sum })} />
      <OpDescriptionField
        description={updOp.description ?? op.description}
        onChange={(description) => setUpdOp({ ...updOp, description })}
      />
      <CategorySelectField
        idCat={updOp.idCategory ?? op.idCategory}
        setIdCat={(idCategory) => setUpdOp({ ...updOp, idCategory })}
      />
      <span className="flex-row gap-1 align-self-end">
        <Button isPending={isSaving} size='l' tooltip="Reset" onPress={reset}><IconRestore /></Button>
        {onCancel && <Button size='l' onPress={onCancel}>Cancel</Button>}
        <Button
          size='l'
          variant="attention"
          type="submit"
          isPending={isSaving}
        >
          {isSaving ? <>Update <Spinner /></> : 'Update'}
        </Button>
      </span>
    </Form>
  )
}
