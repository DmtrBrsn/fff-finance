import { CatSelectTags } from '@features/categories/ui/fields-for-category'
import { useOperationsAdd } from '@features/operations/api'
import { getOpDraft, OperationAdd, removeOpDraft, updateOpDraft } from '@features/operations/lib'
import { toast } from "@features/toaster"
import { Dates } from '@shared/lib/utils'
import { Button, Popover } from '@shared/ui/react-aria'
import { Spinner } from '@shared/ui/spinner/spinner'
import { IconCalculator, IconRestore } from '@tabler/icons-react'
import { FormEvent, useState } from 'react'
import { DialogTrigger, Form } from 'react-aria-components'
import { OpDateField, OpDescriptionField, OpSumField } from './operation-fields'
import { Calculator } from '@features/calculator'
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
    await add({ ...op, created: Dates.now({ withTime: true }) })
    reset()
    onSuccess && onSuccess()
  }

  return (
    <Form onSubmit={handleSubmit} className='react-aria-Form new-operation-form'>
      <OpDateField date={op.date} onChange={(date) => setOpAndDraft({ ...op, date })} />
      <span className='flex-row gap-1 align-end'>
        <OpSumField sum={op.sum} onChange={(sum) => setOpAndDraft({ ...op, sum })} />
        <DialogTrigger>
          <Button size='l'>
            <IconCalculator />
          </Button>
          <Popover>
            {(close) => (
              <Calculator
                value={op.sum}
                setValue={(sum) => setOpAndDraft({ ...op, sum })}
                close={close}
              />
            )}
          </Popover>
        </DialogTrigger>
      </span>
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
          <IconRestore />
        </Button>
        {onCancel && <Button size='l' type="button" onPress={onCancel}>Cancel</Button>}
        <Button
          size='l'
          variant='attention'
          type="submit"
          isPending={isSaving}
        >
          {isSaving ? <>Save <Spinner /></> : 'Save'}
        </Button>
      </span>
    </Form>
  )
}
