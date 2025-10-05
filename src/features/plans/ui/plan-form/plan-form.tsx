import { CalculatorPopover } from '@features/calculator'
import { CategorySelectField } from "@features/categories/ui/fields-for-category"
import { usePlansAdd, usePlansUpdate } from "@features/plans/api"
import { Plan, PlanFormValues, PlanUtils } from "@features/plans/lib"
import { toast } from "@features/toaster"
import { weekdays } from "@shared/lib/contants"
import { Dates } from "@shared/lib/utils"
import { Button } from "@shared/ui/react-aria"
import { Spinner } from "@shared/ui/spinner/spinner"
import { IconRestore } from '@tabler/icons-react'
import { FormEvent, useMemo, useState } from "react"
import { Form } from "react-aria-components"
import { EndTypeChooser, PlanDateEndField, PlanDateStartField, PlanDescriptionField, PlanEveryField, PlanRepeatEveryNumberField, PlanRepeatWeekSetup, PlanSumField, PlanTimesField } from "./plan-fields"

export const PlanForm = (
  { mode, plan, onSuccess, onCancel, }: { mode: 'add' | 'edit', plan?: Plan, onSuccess?: () => void, onCancel?: () => void, }
) => {

  const initPlan: PlanFormValues = {
    dateStart: mode === 'add' ? Dates.now() : plan?.dateStart,
    dateEnd: plan?.dateEnd,
    sum: plan?.sum ?? 0,
    idCategory: plan?.idCategory,
    description: plan?.description ?? '',
    every: plan?.every ?? 'off',
    everyNumber: plan?.everyNumber ?? 1,
    weekdays: plan?.weekdays ?? [],

    times: 1,
    endType: plan?.dateEnd ? 'date' : plan && plan.dateEnd == undefined ? 'never' : 'times'
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
    onSuccess && onSuccess()
  }

  const opCount = useMemo(
    () => PlanUtils.getPlanOperationsCountForForm(values),
    [values]
  )

  useMemo(
    () => {
      if (values.dateStart === undefined) return
      const startWeekDay = weekdays[Dates.getWeekDay(values.dateStart)]
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
      <span className='flex-row gap-1 align-end'>
        <PlanSumField sum={values.sum} onChange={(sum) => setValues({ ...values, sum })} />
        <CalculatorPopover
          value={values.sum}
          setValue={(sum) => setValues({ ...values, sum })}
        />
      </span>
      <PlanDescriptionField description={values.description} onChange={(description) => setValues({ ...values, description })} />
      <CategorySelectField
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
      <span className="flex-row gap-1 align-self-end">
        <Button tooltip='Reset' type="button" size='l' isPending={isSaving} onPress={reset}><IconRestore /></Button>
        {onCancel && <Button type="button" size='l' onPress={onCancel}>Cancel</Button>}
        <Button
          size='l'
          variant='attention'
          type="submit"
          isPending={isSaving || isEditing}
        >
          <>
            {mode === 'add' ? 'Save' : 'Update'}
            {(isSaving || isEditing) ? <Spinner /> : ''}
          </>
        </Button>
      </span>
    </Form>
  )
}
