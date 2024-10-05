import { createRecurrentOps, Operation, OperationUpd, useOperationsBatchAdd, useOperationsBatchDelete, useOperationsGet, useOperationsUpdate } from "@entities/operations"
import { RecurrentOpSettingsUpd, useRecurrentOpSettingsDelete, useRecurrentOpSettingsGet, useRecurrentOpSettingsUpdate } from "@entities/recurrent-op-settings"
import { OpCategorySelectField, OpDateField, OpDescriptionField, OpPlanField, OpSumField, RecurrentOpSetup } from "@features/operation-fields"
import { ButtonGroup } from "@shared/button-group/button-group"
import { Button, ToggleButton } from "@shared/react-aria"
import { Spinner } from "@shared/spinner"
import { DeleteIcon, RepeatIcon } from "@shared/svg"
import { FormEvent, useState } from "react"
import { Form } from "react-aria-components"
import { toast } from "react-toastify"

type EditOperationFormProps = {
  op: Operation
  onSuccess?: () => void
  onCancel?: () => void
}

export const EditOperationForm = ({op, onSuccess, onCancel}: EditOperationFormProps) => {
  const [recurrentMode, setRecurrentMode] = useState(false)
  const [updOp, setUpdOp] = useState<OperationUpd>({id: op.id})
  
  const { data: ros, isFetching: rosFetching } =
  useRecurrentOpSettingsGet(
    op.idRecurrent ?? '',
    op.idRecurrent != undefined && recurrentMode
  )
  const [updRos, setUpdRos] = useState<RecurrentOpSettingsUpd | null | undefined>(ros)
  const { data: recurrentOps, isFetching: recurrentOpsFetching } =
  useOperationsGet(
      { idRecurrent: op.idRecurrent ?? '' },
      op.idRecurrent != undefined && recurrentMode
    )
  const { mutateAsync: update, isPending: updatePending } = useOperationsUpdate()
  const { mutateAsync: updateRos, isPending: updateRosPending } = useRecurrentOpSettingsUpdate()
  const { mutateAsync: deleteRos, isPending: deleteRosPending } = useRecurrentOpSettingsDelete()
  const { mutateAsync: deleteBatch, isPending: deleteBatchPending } = useOperationsBatchDelete()
  const { mutateAsync: addBatch, isPending: addBatchPending } = useOperationsBatchAdd()

  const isSaving = updatePending || updateRosPending || deleteRosPending || deleteBatchPending || addBatchPending;

  const updateRosAndOps = async () => {
    if (updRos == null || recurrentOps == null) return
    const newOpProto = { ...op, ...updOp }
    let {id, ...newOpProtoWithoutId} = newOpProto
    const newRecurrentOps = createRecurrentOps(newOpProtoWithoutId, updRos)
    //объединить в один batch или транзакцию
    await updateRos(updRos)
    await deleteBatch(recurrentOps.map(op => op.id))
    await addBatch(newRecurrentOps)
  }

  const deleteRosAndOps = async () => {
    if (updRos == null || recurrentOps == null) return
    //объединить в один batch или транзакцию
    await deleteBatch(recurrentOps.map(op => op.id))
    await deleteRos(updRos.id)
  }

  const handleIsPlanChange = (isPlan: boolean) => {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (recurrentMode) {
      await updateRosAndOps()
      toast('Записи обновлены')
    }
    else {
      if (Object.keys(updOp).length === 1) {
        onSuccess && onSuccess()
        return
      }
      await update(updOp)
      toast('Запись изменена')
    }
    onSuccess && onSuccess()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <OpDateField date={updOp.date ?? op.date} onChange={(date) => setUpdOp({ ...updOp, date })} />
      <OpSumField sum={updOp.sum ?? op.sum} onChange={(sum) => setUpdOp({ ...op, sum })} />
      <OpDescriptionField
        description={updOp.description ?? op.description}
        onChange={(description) => setUpdOp({ ...op, description })}
      />
      <OpCategorySelectField
        idCat={updOp.idCategory ?? op.idCategory}
        setIdCat={(idCategory) => setUpdOp({ ...op, idCategory })}
      />
      <OpPlanField isPlan={updOp.isPlan ?? op.isPlan} onChange={handleIsPlanChange} />
      {(op.idRecurrent && updOp.isPlan) &&
        <ToggleButton
          isSelected={recurrentMode}
          onPress={() => setRecurrentMode(!recurrentMode)}
        ><RepeatIcon/>Change recurrent</ToggleButton>
      }
      {rosFetching || recurrentOpsFetching ? <Spinner /> :
        (op.idRecurrent && recurrentMode && updRos) ?
        <>
          Recurrent count: {recurrentOps?.length}
          <Button onPress={deleteRosAndOps}><DeleteIcon/>Delete recurrent</Button>
          {//@ts-ignore
            <RecurrentOpSetup op={op} ros={updRos} setRos={setUpdRos} />
          }
        </> : <></>
      }
      <ButtonGroup>
        <Button type="submit">
          {isSaving ? <Spinner /> : recurrentMode ? 'Update recurrent' : 'Update'}
        </Button>
        <Button onPress={onCancel}>Cancel</Button>
      </ButtonGroup>
    </Form>
  )
}
