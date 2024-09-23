
import { useState, FormEvent } from 'react'
import { addMonths, getDay} from "date-fns"
import { toast } from 'react-toastify'
import { getOpDraft, updateOpDraft, removeOpDraft } from '@entities/operations/operation-draft'
import { useCategoriesGet } from '@entities/categories'
import { OperationAdd, useOperationsAdd, useOperationsBatchAdd, createRecurrentOps } from '@entities/operations'
import { RecurrentOpSettingsAdd, weekdays, useRecurrentOpSettingsAdd } from '@entities/recurrent-op-settings'
import { RecurrentOpSetup } from '@shared/recurrent-op-setup'
import { Spinner } from '@shared/spinner'
import { StripSelect } from '@shared/strip-select'
import { DateUtils } from '@shared/utils'
import { Button } from 'react-aria-components'
import { Checkbox, DateField, NumberField, TextField } from '@shared/react-aria'
import { parseDate } from '@internationalized/date'

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

  const initRepeatOptions: RecurrentOpSettingsAdd = {
    every: undefined,
    everyNumber: 1,
    times: 1,
    endsOn: DateUtils.dateToIsoStr(addMonths(op.date, 1)),
    weekdays: [weekdays[getDay(op.date)]],
    useTimes: true
  }

  const [repeatOptions, setRepeatOptions] = useState(initRepeatOptions)
  
  const setOpAndDraft = (newValues: OperationAdd) => {
    setOp(newValues)
    updateOpDraft(newValues)
  }

  const updateOpDate = (date: string) => {
    setOpAndDraft({ ...op, date })
    if (op.isPlan && repeatOptions.every === 'week' && repeatOptions.weekdays != undefined) {
      setRepeatOptions({ ...repeatOptions, weekdays: [weekdays[getDay(date)]] })
    }
  }
  const { data: categories, isFetching: catsFetching, error: catError } = useCategoriesGet(true)
  const addHook = useOperationsAdd()
  const addBatchHook = useOperationsBatchAdd()
  const addRecurrentOpSettingsHook = useRecurrentOpSettingsAdd()

  const getIncExpStr = () => {
    const isIncome = categories?.find(cat => cat.id === op.idCategory)?.isIncome
    return isIncome === false ? 'Expense' : isIncome ? 'Income' : '-';
  }

  const reset = () => {
    setOp(initOp)
    setRepeatOptions(initRepeatOptions)
    removeOpDraft()
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (op.idCategory === '') {
      toast.error('Необходимо выбрать категорию')
      return
    }
    if (op.isPlan && repeatOptions.every) saveRepeatingOps()
    else saveOp()
  }

  const saveOp = async () => {
    await addHook.mutateAsync({ ...op, created: DateUtils.getCurIsoStr() })
    reset()
  }

  const saveRepeatingOps = async () => {
    const newRos = await addRecurrentOpSettingsHook.mutateAsync(repeatOptions)
    const newOps = createRecurrentOps(op, newRos)
    await addBatchHook.mutateAsync(newOps)
  }

  return (
    <form onSubmit={handleSubmit} className="new-operation-form">
      <h2>Adding operation</h2>
      <DateField
        label='Date'
        value={parseDate(op.date)}
        isRequired
        withButtons
        onChange={(d) => updateOpDate(d.toString())}
      />
      <NumberField
        label='Sum'
        minValue={0}
        step={0.01}
        value={op.sum}
        isRequired
        onChange={(e) => setOpAndDraft({ ...op, sum: e })}
      />
      <TextField
        label='Description'
        name="opDescription"
        value={op.description}
        isRequired
        maxLength={300}
        onChange={(e) => setOpAndDraft({ ...op, description: e })}
      />

      <span className="field vert">
        <label htmlFor="opCat">Category</label>
        {catError ? `Error: ${catError.message}` : catsFetching || categories===undefined ? 
          <Spinner/>
          :
          <>
            <StripSelect
              items={categories.map(c => [c.id, c.name])}
              selectedKeyByDefault={op.idCategory!=='' ? op.idCategory : undefined}
              onSelect={(e) => setOpAndDraft({ ...op, idCategory: categories.find(cat => cat.id === e.target.key)?.id ?? '' })}
            />
            <span>
              {getIncExpStr()}
            </span>
          </>
        }
      </span>
      <Checkbox
        isSelected={op.isPlan}
        onChange={(isPlan)=> setOpAndDraft({...op, isPlan})}
      >Plan</Checkbox>
      {op.isPlan && <RecurrentOpSetup op={op} repeatOptions={repeatOptions} setRepeatOptions={setRepeatOptions} />}
      <Button type="submit" isDisabled={addHook.isPending}> {addHook.isPending ? <Spinner /> : 'Save'}</Button>
      <Button type="button" isDisabled={addHook.isPending || operationDraft==null} onPress={reset}>Reset</Button>
    </form>
  )
}
