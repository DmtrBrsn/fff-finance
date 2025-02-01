import { useState, FormEvent } from 'react'
import { toast } from "@features/toaster"
import { Spinner } from '@shared/ui/spinner/spinner'
import { Dates } from '@shared/lib/utils'
import { Button } from '@shared/ui/react-aria'
import { CatSelectTags } from '@features/categories/ui/fields-for-category'
import { Form } from 'react-aria-components'
import { ResetIcon } from '@shared/ui/svg'
import { useOperationsAdd } from '@features/operations/api'
import { getOpDraft, OperationAdd, updateOpDraft, removeOpDraft } from '@features/operations/lib'
import { OpDateField, OpSumField, OpDescriptionField } from './operation-fields'
import './new-operation-form.css'

export const NewOperationForm = ({ onSuccess, onCancel }: { onSuccess?: () => void, onCancel?: () => void }) => {
  const operationDraft = getOpDraft()

  const initOp = {
    date: Dates.now(),
    description: '',
    idCategory: '',
    created: '',
    sum: 0
  }

  const [op, setOp] = useState<OperationAdd>(operationDraft != null ? operationDraft : initOp)

  const setOpAndDraft = (newValues: OperationAdd) => {
    setOp(newValues)
    updateOpDraft(newValues)
  }

  const { mutateAsync: add, isPending: isSaving } = useOperationsAdd()

  const reset = () => {
    setOp(initOp)
    removeOpDraft()
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (op.idCategory === '') {
      toast.error('Please choose a category')
      return
    }
    await add({ ...op, created: Dates.now() })
    reset()
    onSuccess && onSuccess()
  }

  return (
    <Form onSubmit={handleSubmit} className='react-aria-Form new-operation-form'>
      <OpDateField date={op.date} onChange={(date) => setOpAndDraft({ ...op, date })} />
      <OpSumField sum={op.sum} onChange={(sum) => setOpAndDraft({ ...op, sum })} />
      <OpDescriptionField
        description={op.description}
        onChange={(description) => setOpAndDraft({ ...op, description })}
      />
      <CatSelectTags
        selectedId={op.idCategory}
        onSelect={(idCategory: string) => setOpAndDraft({ ...op, idCategory })}
      />
      <span className="flex-row gap-1 align-self-end">
        <Button
          size='l'
          type="button"
          tooltip="Reset"
          isDisabled={isSaving || operationDraft == null}
          onPress={reset}
        >
          <ResetIcon />
        </Button>
        {onCancel && <Button size='l' type="button" onPress={onCancel}>Cancel</Button>}
        <Button
          size='l'
          variant='attention'
          type="submit"
          isPending={isSaving}
        >
          {isSaving ? <Spinner /> : 'Save'}
        </Button>
      </span>
    </Form>
  )
}
