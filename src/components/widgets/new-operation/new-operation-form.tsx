import { FormEvent, useState, useRef } from "react"
import { DateUtils } from "../../../utils/dateUtils"
import { Spinner } from "../../common/spinner"
import { BtnIcon } from "../../common/btn-icon"
import { StripSelect } from "../../common/strip-select/strip-select"
import { toast } from "react-toastify"
import { OperationAdd, useCategoriesGet } from "../../../db"
import { useOperationsAdd } from "../../../db/operations"
import { getOpDraft, removeOpDraft, updateOpDraft } from "./operation-draft"

import './new-operation-form.css'
import { Timestamp } from "firebase/firestore"

export const NewOperationForm = () => {

  const operationDraft = getOpDraft()

  const initOp = {
    date: Timestamp.now(),
    description: '',
    idCategory:'',
    created: Timestamp.now(),
    isPlan: false,
    sum:0
  }

  const [op, setOp] = useState<OperationAdd>(operationDraft != null ? JSON.parse(operationDraft) : initOp)
  
  const setOpAndDraft = (newValues: OperationAdd) => {
    setOp(newValues)
    updateOpDraft(newValues)
  }

  const sumInpRef = useRef<HTMLInputElement>(null)
  const selectSum = ()=>sumInpRef.current!==null && sumInpRef.current.value==='0' && sumInpRef.current.select()

  const { data: categories, isFetching: catsFetching } = useCategoriesGet(false)
  const addHook = useOperationsAdd()

  const getIncExpStr = () => {
    const isIncome = categories?.find(cat => cat.id === op.idCategory)?.isIncome
    return isIncome === false ? 'Expense' : isIncome ? 'Income' : '-';
  }

  const plusDay = () => setOpAndDraft({ ...op, date: Timestamp.fromDate(DateUtils.incrementDatePeriod(op.date.toDate(), 'D')) })
  const minusDay = ()=> setOpAndDraft({...op, date: Timestamp.fromDate(DateUtils.decrementDatePeriod(op.date.toDate(), 'D')) })

  const reset = () => {
    setOp(initOp)
    removeOpDraft()
  }

  const saveOp = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (op.idCategory === '') {
      toast.error('Необходимо выбрать категорию')
      return
    }
    const newDoc = { ...op, created: Timestamp.now() }
    await addHook.mutateAsync({ newDoc })
    reset()
  }

  return (
    <form onSubmit={saveOp} className="new-operation-form">
      <label>Adding operation{operationDraft ? ' (draft saved)' : '' }</label>
      <span className="field vert">
        <span className="hor">
          <label htmlFor="opDate">Date</label>
          <BtnIcon content={"-"} onClick={minusDay}/>
          <BtnIcon content={"+"} onClick={plusDay}/>
        </span>
        <input
          type="date"
          lang="ru-RU"
          id="opDate"
          value={DateUtils.tsToIsoStr(op.date)}
          required
          onChange={(e) => setOpAndDraft({...op, date: DateUtils.isoStrToTs(e.target.value) })}
        />
      </span>
      <span className="field vert">
        <label htmlFor="opSum">Sum</label>
        <input
          type="number"
          id="opSum"
          min="0"
          step="0.01"
          value={op.sum}
          required
          onChange={(e) => setOpAndDraft({ ...op, sum: parseFloat(e.target.value) })}
          onClick={selectSum}
          ref={sumInpRef}
        />
      </span>
      <span className="field vert">
        <label htmlFor="opDescription">Description</label>
        <input
          type="text"
          id="opDescription"
          name="description"
          value={op.description}
          required
          onChange={(e)=> setOpAndDraft({...op, description: e.target.value})}
        />
      </span>
      
      <span className="field vert">
        <label htmlFor="opCat">Category</label>
        {catsFetching || categories===undefined ? 
          <Spinner/>
          :
          <>
            <StripSelect
              items={categories.map(c => [c.id, c.name])}
              selectedKeyByDefault={op.idCategory!=='' ? op.idCategory : undefined}
              onSelect={(e) => setOpAndDraft({ ...op, idCategory: categories.find(cat => cat.id === e.target.key)?.id ?? '' })}
            />
            {/* <select
              id="opCat"
              multiple={true}
              size={categories.length>=3 ? 3 : categories.length}
              value={(op.idCategory !== '') ? [op.idCategory] : ['']}
              required
              onChange={(e) => setOpAndDraft({ ...op, idCategory: categories.find(cat => cat.id === e.target.value)?.id ?? '' })}
            >
              {
                categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)
              }
            </select> */}
            <span>
              {getIncExpStr()}
            </span>
          </>
        }
      </span>
      <span className="field hor">
        <label htmlFor="opIsPlan">Is plan</label>
        <input
          type="checkbox"
          id="opIsPlan"
          checked={op.isPlan}
          onChange={(e)=> setOpAndDraft({...op, isPlan: e.target.checked})}
        />
      </span>
      <button type="submit" disabled={addHook.isPending} className="btn-std">Save</button>
      <button type="reset" disabled={addHook.isPending} className="btn-std" onClick={reset}>Reset</button>
    </form>
  )
}

