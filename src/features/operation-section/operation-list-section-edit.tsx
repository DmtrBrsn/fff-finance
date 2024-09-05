import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useCategoriesGet } from "@entities/categories";
import { Operation, useOperationsUpdate, OperationUpd, createRecurrentOps, useOperationsGet, useOperationsBatchDelete, useOperationsBatchAdd } from "@entities/operations";
import { BtnIcon } from "@shared/btn-icon";
import { Spinner } from "@shared/spinner";
import { DoneIcon, CancelIcon, RepeatIcon, DeleteIcon } from "@shared/svg";
import { RecurrentOpSetup } from "@shared/recurrent-op-setup";
import { RecurrentOpSettingsUpd, useRecurrentOpSettingsDelete, useRecurrentOpSettingsGet, useRecurrentOpSettingsUpdate } from "@entities/recurrent-op-settings";
import './operation-section.style.css'
import { FlCell, FlRow } from "@shared/fl-list";
import { useOpsListStore } from "@widgets/operations-list/operations-list-store";
import { DateUtils } from "@shared/utils";

export const OperationListSectionEdit = (
  { op }: { op: Operation }
) => {
  const [recurrentMode, setRecurrentMode] = useState(false)
  const { selected, selectMode, setSelected, setBeingEdited } = useOpsListStore()
  const isSelected = selected.includes(op.id)
  const { data: cats } = useCategoriesGet(false)
  const { data: recurrentOptions, isFetching: recurrentOptionsFetching } = useRecurrentOpSettingsGet(op.idRecurrent ?? '', op.idRecurrent != undefined && recurrentMode)
  const { data: recurrentOps, isFetching: recurrentOpsFetching } = useOperationsGet({ idRecurrent: op.idRecurrent ?? '' }, op.idRecurrent != undefined && recurrentMode)
  const [recurrentOptionsUpdated, setRecurrentOptionsUpdated] = useState<RecurrentOpSettingsUpd | null | undefined>(undefined)
  const updateHook = useOperationsUpdate()
  const updateRecurrentHook = useRecurrentOpSettingsUpdate()
  const deleteRecurrentHook = useRecurrentOpSettingsDelete()
  const deleteBatchOpHook = useOperationsBatchDelete()
  const [updOp, setUpdOp] = useState<OperationUpd>(op)
  const addBatchOpHook = useOperationsBatchAdd()
  const isInc = cats?.find(c => c.id === updOp.idCategory)?.isIncome

  useEffect(() => {
    setRecurrentOptionsUpdated(recurrentOptions)
  }, [recurrentOptions])

  const handleIsPlanUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isPlan = e.target.checked
    if (!isPlan && op.idRecurrent) {
      setRecurrentMode(false)
      setUpdOp({ ...updOp, isPlan, idRecurrent: null })
    }
    else if (isPlan && op.idRecurrent) {
      setUpdOp({ ...updOp, isPlan, idRecurrent: op.idRecurrent })
    }
    else {
      setUpdOp({ ...updOp, isPlan })
    }
  }

  const disableUpd = () => setBeingEdited(null)

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.checked ?
      setSelected([...selected, op.id])
      :
      setSelected(selected.filter(id => id !== op.id))
  }

  const updateRecurrentOptionsAndOps = async () => {
    if (recurrentOptionsUpdated == null || recurrentOps == null) return
    const newOpProto = { ...op, ...updOp }
    let {id, ...newOpProtoWithoutId} = newOpProto
    const newRecurrentOps = createRecurrentOps(newOpProtoWithoutId, recurrentOptionsUpdated)
    //объединить в один batch или транзакцию
    await updateRecurrentHook.mutateAsync(recurrentOptionsUpdated)
    await deleteBatchOpHook.mutateAsync(recurrentOps.map(op => op.id))
    await addBatchOpHook.mutateAsync(newRecurrentOps)
  }

  const deleteReccurentOptionsAndOps = async () => {
    if (recurrentOptionsUpdated == null || recurrentOps == null) return
    //объединить в один batch или транзакцию
    await deleteBatchOpHook.mutateAsync(recurrentOps.map(op => op.id))
    await deleteRecurrentHook.mutateAsync(recurrentOptionsUpdated.id)
  }

  const handleUpdate = async () => {
    if (updOp.idCategory == undefined || updOp.idCategory==='') {
      toast.error('Не выбрана категория!')
      return
    }
    if (recurrentMode) {
      await updateRecurrentOptionsAndOps()
      toast('Записи обновлены')
    }
    else {
      if (JSON.stringify(op) === JSON.stringify(updOp)) {
        disableUpd()
        return
      }
      await updateHook.mutateAsync(updOp)
      toast('Запись изменена')
    }
    disableUpd()
  }

  return (
    <FlRow className={isInc ? 'op-income-section' : ''}>
      {selectMode &&
        <FlCell className="op-checkbox">
          <input type="checkbox" checked={isSelected} onChange={handleCheckboxChange} />
        </FlCell>}
      <FlCell className="op-date">
        <input type='date'
          value={updOp.date==undefined ? '' : updOp.date}
          onChange={(e) => setUpdOp({ ...updOp, date: e.target.value})}
        />
      </FlCell>
      <FlCell className="op-sum">
        <input
          type='number'
          min="0"
          step="0.01"
          value={updOp.sum}
          onChange={(e) => setUpdOp({...updOp, sum: parseFloat(e.target.value)})}
        />
      </FlCell>
      <FlCell className="op-description">
        <input
          type='text'
          name="description"
          minLength={1}
          value={updOp.description}
          onChange={(e) => setUpdOp({ ...updOp, description: e.target.value })}
        />
      </FlCell>
      <FlCell className="op-category">
        <select
          value={updOp.idCategory}
          onChange={(e) => setUpdOp({ ...updOp, idCategory: cats?.find(c=>c.id===e.target.value)?.id})}
        >
          {cats?.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </FlCell>
      <FlCell className="op-is-income">
        {isInc==undefined ? '' : isInc ? 'Income' : 'Expense'}
      </FlCell>
      <FlCell className="op-is-plan">
        <input type="checkbox"
          checked={updOp.isPlan}
          onChange={handleIsPlanUpdate}
        />
      </FlCell>
      <FlCell className="op-date">{DateUtils.isoStrToLocal(op.created)}</FlCell>
      <FlCell className="op-buttons">
        {updateHook.isPending ? <Spinner /> : <BtnIcon content={<DoneIcon />} onClick={handleUpdate} title={recurrentMode ? 'Update recurrent' : 'Update' }/>}
        <BtnIcon content={<CancelIcon />} onClick={disableUpd}/>
      </FlCell>
    
      {(op.idRecurrent && updOp.isPlan) &&
        <span className="op-buttons">
          <BtnIcon
            content={<RepeatIcon />}
            title="Recurrent editing mode"
            onClick={() => setRecurrentMode(!recurrentMode)}
          />
        </span>
      }
      {recurrentOptionsFetching || recurrentOpsFetching ? <Spinner /> :
        (op.idRecurrent && recurrentMode && recurrentOptionsUpdated) ?
        <>
          Recurrent count: {recurrentOps?.length}
            {
              <span className="op-buttons">
                <BtnIcon
                  content={<DeleteIcon />}
                  title={'Delete recurrent'}
                  onClick={deleteReccurentOptionsAndOps}
                />
              </span>
          }
          {//@ts-ignore
            <RecurrentOpSetup op={op} repeatOptions={recurrentOptionsUpdated} setRepeatOptions={setRecurrentOptionsUpdated} />
          }
        </> : <></>
      }
    </FlRow>
  )
}
