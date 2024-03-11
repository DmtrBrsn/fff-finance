import { FormEvent, useEffect, useState, useRef } from "react"
import { getAllCategories } from "../../db/categories.queries"
import { DateUtils } from "../../utils/dateUtils"
import { Spinner } from "../common/spinner"
import { addOperation } from "../../db/operations.queries"
import { BtnIcon } from "../common/btn-icon"
import { StripSelect } from "../common/strip-select/strip-select"
import { toast } from "react-toastify"

export const NewOperationForm = () => {

  const initOp = {
    date: DateUtils.getCurInpDate(),
    description: '',
    idCategory:'',
    created: '',
    isPlan: false,
    sum:0
  }

  const [op, setOp] = useState<Omit<Operation, "id">>(initOp)
  const [catsLoading, setCatsLoading] = useState(false)
  const [addNewLoading, setAddNewLoading] = useState(false)
  const [categories, setCategories] = useState<Category[] | []>([])

  const sumInpRef = useRef<HTMLInputElement>(null);
  const selectSum = ()=>sumInpRef.current!==null && sumInpRef.current.select()

  const fetchCats = async () => {
    setCatsLoading(true)
    const categoriesArr = await getAllCategories()
    setCategories(categoriesArr)
    setCatsLoading(false)
  }

  const getIncExpStr = () => {
    const isIncome = categories.find(cat => cat.id === op.idCategory)?.isIncome
    return isIncome === false ? 'Expense' : isIncome ? 'Income' : '-';
  }

  useEffect(() => {
    fetchCats()
    return () => { }
  }, [])

  const shiftDay = (sign: '+' | '-') => {
    if (op.date)
      return sign === '+'
      ?
      setOp({...op, date: DateUtils.formatDateForInput(DateUtils.incrementDatePeriod(new Date(op.date),'D'))})
      :
      setOp({...op, date: DateUtils.formatDateForInput(DateUtils.decrementDatePeriod(new Date(op.date),'D'))})
  }

  const saveOp = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (op.idCategory === '') {
      toast.error('Необходимо выбрать категорию')
      return
    }
    setAddNewLoading(true)
    setOp(initOp)
    const newOp = {...op, created: DateUtils.getCurIsoStr()}
    addOperation(newOp)
    .then(addedDoc => {
      setAddNewLoading(false)
      if (addedDoc === null) {
        setOp(newOp)
      }
    })
  }

  return (
    <form onSubmit={saveOp} className="new-operation-form">
      <span className="field vert">
        <span className="hor">
          <label htmlFor="opDate">Date</label>
          <BtnIcon content={"-"} onClick={()=>shiftDay('-')}/>
          <BtnIcon content={"+"} onClick={()=>shiftDay('+')}/>
        </span>
        <input
          type="date"
          id="opDate"
          value={op.date}
          required
          onChange={(e) => setOp({...op, date: e.target.value})}
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
          onChange={(e) => setOp({ ...op, sum: parseFloat(e.target.value) })}
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
          onChange={(e)=> setOp({...op, description: e.target.value})}
        />
      </span>
      
      <span className="field vert">
        <label htmlFor="opCat">Category</label>
        {catsLoading ? 
          <Spinner/>
          :
          <>
            <StripSelect
              items={categories.map(c => [c.id, c.name])}
              onSelect={(e) => setOp({ ...op, idCategory: categories.find(cat => cat.id === e.target.selectedKey)?.id ?? '' })}
            />
            {/* <select
              id="opCat"
              multiple={true}
              size={categories.length>=3 ? 3 : categories.length}
              value={(op.idCategory !== '') ? [op.idCategory] : ['']}
              required
              onChange={(e) => setOp({ ...op, idCategory: categories.find(cat => cat.id === e.target.value)?.id ?? '' })}
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
          onChange={(e)=> setOp({...op, isPlan: e.target.checked})}
        />
      </span>
      <button type="submit" disabled={addNewLoading} className="btn-std">Save</button>
    </form>
  )
}

