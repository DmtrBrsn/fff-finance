import { CategorySelectField } from "@features/categories/ui/fields-for-category"
import { Button } from "@shared/react-aria"
import { Spinner } from "@shared/spinner"
import { FormEvent, useState } from "react"
import { Form, Heading } from "react-aria-components"
import { toast } from "@features/toaster"
import { ResetIcon } from "@shared/svg"
import { useOperationsUpdate } from "@features/operations/api"
import { Operation, OperationUpd } from "@features/operations/lib"
import { OpDateField, OpSumField, OpDescriptionField } from "./operation-fields"

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
      <Heading slot="title">Edit operation</Heading>
      <OpDateField date={updOp.date ?? op.date} onChange={(date) => setUpdOp({ ...updOp, date })} />
      <OpSumField sum={updOp.sum ?? op.sum} onChange={(sum) => setUpdOp({ ...updOp, sum })} />
      <OpDescriptionField
        description={updOp.description ?? op.description}
        onChange={(description) => setUpdOp({ ...updOp, description })}
      />
      <CategorySelectField
        idCat={updOp.idCategory ?? op.idCategory}
        setIdCat={(idCategory) => setUpdOp({ ...updOp, idCategory })}
      />
      <span className="flex-row gap-1">
        <Button variant="attention" type="submit">
          {isSaving ? <Spinner /> : 'Update'}
        </Button>
        {onCancel && <Button onPress={onCancel}>Cancel</Button>}
        <Button tooltip="Reset" onPress={reset}><ResetIcon/></Button>
      </span>
    </Form>
  )
}
