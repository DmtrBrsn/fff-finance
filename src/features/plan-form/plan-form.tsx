import { toast } from "@app/toaster"
import { Plan, PlanFormValues, PlanUtils, usePlansAdd, usePlansUpdate } from "@entities/plans"
import { CategoryComboboxField } from "@features/fields-for-category"
import { EndTypeChooser, PlanDateEndField, PlanDateStartField, PlanDescriptionField, PlanEveryField, PlanRepeatEveryNumberField, PlanRepeatWeekSetup, PlanSumField, PlanTimesField } from "@features/plan-form/plan-fields"
import { weekdays } from "@shared/contants"
import { Button } from "@shared/react-aria"
import { Spinner } from "@shared/spinner"
import { ResetIcon } from "@shared/svg"
import { DateUtils } from "@shared/utils"
import { FormEvent, useMemo, useState } from "react"
import { Form } from "react-aria-components"

export const PlanForm = (
  { mode, plan, onSuccess, onCancel,  }: { mode: 'add' | 'edit', plan?: Plan, onSuccess?: () => void, onCancel?: () => void,  }
) => {

  const initPlan: PlanFormValues = {
    dateStart: plan?.dateStart ??  DateUtils.getCurInpDate(),
    dateEnd: plan?.dateEnd ?? undefined,
    sum: plan?.sum ?? 0,
    idCategory: plan?.idCategory ?? undefined,
    description: plan?.description ?? '',
    every: plan?.every ?? 'off',
    everyNumber: plan?.everyNumber ?? 1,
    weekdays: plan?.weekdays ?? [],

    times: 1,
    endType: plan?.dateEnd ? 'date' :  plan && plan.dateEnd==undefined ? 'never' :  'times'
  }

  const [values, setValues] = useState<PlanFormValues>(initPlan)
  const { mutateAsync: add, isPending: isSaving } = usePlansAdd()
  const { mutateAsync: edit, isPending: isEditing } = usePlansUpdate()

  const reset = () => setValues(initPlan)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (values.every === 'week' && values.weekdays.length === 0) {
      toast.error('Choose at least one weekday')
      return
    }
    if (mode === 'edit' && plan === undefined) throw new Error('plan is undefined')
    const newPlan = PlanUtils.createPlanFromFormValues(values)
    if (mode === 'edit') {
      newPlan.id = plan!.id
      await edit(newPlan as Plan)
    }
    else if (mode === 'add') {
      await add(newPlan)
    }
    reset()
    onSuccess && onSuccess()
  }

  const opCount = useMemo(
    () => PlanUtils.getPlanOperationsCountForForm(values),
    [values]
  )

  useMemo(
    () => {
      if (values.dateStart === undefined) return
      const startWeekDay = weekdays[DateUtils.getWeekDay(values.dateStart)]
      const newWd = [...new Set([...values.weekdays, startWeekDay])]
      setValues({
        ...values,
        weekdays: newWd
      })
    },
    [values.dateStart]
  )

  return (
    <Form onSubmit={handleSubmit}>
      <PlanDateStartField
        dateStart={values.dateStart}
        onChange={(date) => setValues({ ...values, dateStart: date })}
      />
      <PlanSumField sum={values.sum} onChange={(sum) => setValues({ ...values, sum })} />
      <PlanDescriptionField description={values.description} onChange={(description) => setValues({ ...values, description })} />
      <CategoryComboboxField
        idCat={values.idCategory ?? null}
        setIdCat={(idCategory) => setValues({ ...values, idCategory })}
      />
      <PlanEveryField
        every={values.every}
        onChange={(every) => setValues({ ...values, every })}
        isDisabled={values.dateStart == undefined}
      />
      {values.every !== 'off' && values.dateStart &&
        <>
          <PlanRepeatEveryNumberField
            everyNumber={values.everyNumber}
            onChange={(everyNumber) => setValues({ ...values, everyNumber })}
            every={values.every}
          />
          {values.every === 'week' &&
            <PlanRepeatWeekSetup
              selectedWeekdays={values.weekdays}
              onChange={(wd) => setValues({ ...values, weekdays: wd })}
            />
          }
          <EndTypeChooser endType={values.endType} onChange={(endType) => setValues({ ...values, endType })} />
          {values.endType === 'times' && <PlanTimesField times={values.times} onChange={(times) => setValues({ ...values, times })} />}
          {values.endType === 'date' &&
            <PlanDateEndField dateStart={values.dateStart} dateEnd={values.dateEnd} onChange={(date) => setValues({ ...values, dateEnd: date })} />
          }
          <code>Operations count: {opCount.toLocaleString()}</code>
        </>
      }
      <span className="flex-row gap-1">
        <Button
          variant='attention'
          type="submit"
          isDisabled={isSaving}
        >
          {isSaving || isEditing ? <Spinner /> : mode==='add' ? 'Save' : 'Update'}
        </Button>
        {onCancel && <Button type="button" isDisabled={isSaving} onPress={onCancel}>Cancel</Button>}
        <Button tooltip='Reset' type="button" isDisabled={isSaving} onPress={reset}><ResetIcon /></Button>
      </span>
    </Form>
  )
}
