import { useState, FormEvent } from 'react'
import { addMonths, getDay} from "date-fns"
import { toast } from 'react-toastify'
import { OperationAdd, useOperationsAdd, useOperationsBatchAdd, createRecurrentOps, getOpDraft, updateOpDraft, removeOpDraft } from '@entities/operations'
import { RecurrentOpSettingsAdd, weekdays, useRecurrentOpSettingsAdd } from '@entities/recurrent-op-settings'
import { RecurrentOpSetup } from '@features/operation-fields'
import { Spinner } from '@shared/spinner'
import { DateUtils } from '@shared/utils'
import { Button } from '@shared/react-aria'
import { CatSelectTags, OpPlanField } from '@features/operation-fields'
import { ButtonGroup } from '@shared/button-group/button-group'
import { OpDateField, OpDescriptionField, OpSumField } from '@features/operation-fields'
import { Form } from 'react-aria-components'

import './new-operation-form.css'

export const NewOperationForm = () => {
  const operationDraft = getOpDraft()

  const initOp = {
    date: DateUtils.getCurInpDate(),
    description: '',
    idCategory:'',
    created: DateUtils.getCurInpDate(),
    isPlan: false,
    sum:0
  }
  
  const [op, setOp] = useState<OperationAdd>(operationDraft != null ? operationDraft : initOp)

  const initRos: RecurrentOpSettingsAdd = {
    every: undefined,
    everyNumber: 1,
    times: 1,
    endsOn: DateUtils.formatDateForInput(addMonths(op.date, 1)),
    weekdays: [weekdays[getDay(op.date)]],
    useTimes: true
  }

  const [ros, setRos] = useState(initRos)
  
  const setOpAndDraft = (newValues: OperationAdd) => {
    setOp(newValues)
    updateOpDraft(newValues)
  }

  const updateOpDate = (date: string) => {
    setOpAndDraft({ ...op, date })
    if (op.isPlan && ros.every === 'week' && ros.weekdays != undefined) {
      setRos({ ...ros, weekdays: [weekdays[getDay(date)]] })
    }
  }
  const { mutateAsync: add, isPending: isAddPending } = useOperationsAdd()
  const { mutateAsync: addBatch, isPending: isBatchAddPending } = useOperationsBatchAdd()
  const { mutateAsync: addRos, isPending: isRosAddPending } = useRecurrentOpSettingsAdd()

  const isSaving = isAddPending || isBatchAddPending || isRosAddPending

  const reset = () => {
    setOp(initOp)
    setRos(initRos)
    removeOpDraft()
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (op.idCategory === '') {
      toast.error('Необходимо выбрать категорию')
      return
    }
    if (op.isPlan && ros.every) saveRepeatingOps()
    else saveOp()
  }

  const saveOp = async () => {
    await add({ ...op, created: DateUtils.getCurIsoStr() })
    reset()
  }

  const saveRepeatingOps = async () => {
    const newRos = await addRos(ros)
    const newOps = createRecurrentOps(op, newRos)
    await addBatch(newOps)
  }

  return (
    <Form onSubmit={handleSubmit} className='react-aria-Form new-operation-form'>
      <OpDateField date={op.date} onChange={(d) => updateOpDate(d)} />
      <OpSumField sum={op.sum} onChange={(sum) => setOpAndDraft({ ...op, sum })} />
      <OpDescriptionField
        description={op.description}
        onChange={(description) => setOpAndDraft({ ...op, description })}
      />
      <CatSelectTags
        selectedId={op.idCategory}
        onSelect={(idCategory: string) => setOpAndDraft({ ...op, idCategory })}
      />
      <OpPlanField isPlan={op.isPlan} onChange={(isPlan) => setOpAndDraft({ ...op, isPlan })} />
      {op.isPlan &&
        <RecurrentOpSetup op={op} ros={ros} setRos={setRos} />}
      <ButtonGroup>
        <Button type="submit" isDisabled={isSaving}> {isSaving ? <Spinner /> : 'Save'}</Button>
        <Button type="button" isDisabled={isSaving || operationDraft==null} onPress={reset}>Reset</Button>
      </ButtonGroup>
    </Form>
  )
}
