import { Operation, OperationUpd, useOperationsUpdate } from "@entities/operations"
import { OpCategorySelectField, OpDateField, OpDescriptionField, OpSumField } from "@features/operation-fields"
import { ButtonGroup } from "@shared/button-group/button-group"
import { Button } from "@shared/react-aria"
import { Spinner } from "@shared/spinner"
import { FormEvent, useState } from "react"
import { Form, Heading } from "react-aria-components"
import { toast } from "react-toastify"

type EditOperationFormProps = {
  op: Operation
  onSuccess?: () => void
  onCancel?: () => void
}

export const EditOperationForm = ({op, onSuccess, onCancel}: EditOperationFormProps) => {
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

  return (
    <Form onSubmit={handleSubmit}>
      <Heading>Edit operation</Heading>
      <OpDateField date={updOp.date ?? op.date} onChange={(date) => setUpdOp({ ...updOp, date })} />
      <OpSumField sum={updOp.sum ?? op.sum} onChange={(sum) => setUpdOp({ ...updOp, sum })} />
      <OpDescriptionField
        description={updOp.description ?? op.description}
        onChange={(description) => setUpdOp({ ...updOp, description })}
      />
      <OpCategorySelectField
        idCat={updOp.idCategory ?? op.idCategory}
        setIdCat={(idCategory) => setUpdOp({ ...updOp, idCategory })}
      />
      <ButtonGroup>
        <Button variant="attention" type="submit">
          {isSaving ? <Spinner /> : 'Update'}
        </Button>
        <Button onPress={onCancel}>Cancel</Button>
      </ButtonGroup>
    </Form>
  )
}
