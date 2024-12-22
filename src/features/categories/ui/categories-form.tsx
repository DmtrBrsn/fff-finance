import { Button, Checkbox, NumberField, TextField } from "@shared/react-aria"
import { DateUtils } from "@shared/utils"
import { useState, FormEvent } from "react"
import { useCategoriesGet, useCategoriesAdd, useCategoriesUpdate } from "../api"
import { Category, CatUtils } from "../lib"
import { Form } from "react-aria-components"

export const CatForm = (
  { mode, cat, onSuccess, onCancel }:
    { mode: 'add' | 'edit', isIncome?: boolean, cat?: Category, onSuccess?: () => void, onCancel?: () => void }
) => {
  const { data: categories } = useCategoriesGet()
  const { mutateAsync: add, isPending: adding } = useCategoriesAdd()
  const { mutateAsync: update, isPending: updating } = useCategoriesUpdate()

  const [values, setValues] = useState({
    name: cat?.name ?? '',
    isIncome: cat?.isIncome ?? false,
    order: mode === 'add' ? categories?.length ?? undefined : cat?.order
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (values.name === '' || (mode === 'edit' && cat === undefined)) return
    if (mode === 'add') {
      await add({
        name: values.name,
        isIncome: values.isIncome,
        order: values.order,
        created: DateUtils.getCurIsoStr()
      })
    }
    else {
      await update({
        id: cat!.id,
        name: values.name,
        isIncome: values.isIncome,
        order: values.order
      })
    }
    onSuccess?.()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextField
        label='Name'
        name="catName"
        value={values.name}
        onChange={(name) => setValues({ ...values, name })}
        isRequired
      />
      <Checkbox
        isSelected={values.isIncome}
        onChange={(e) => setValues({ ...values, isIncome: e })}
      >
        {CatUtils.getIncExpStr({ isIncome: true })}
      </Checkbox>
      <NumberField
        size={1}
        label='Order'
        name="catOrder"
        value={values.order}
        minValue={0}
        step={1}
        onChange={(order) => setValues({ ...values, order })}
      />
      <span className="flex-row gap-1">
        <Button type="submit" variant="attention" isDisabled={adding || updating}>{mode === 'add' ? 'Add' : 'Update'}</Button>
        <Button type="button" onPress={onCancel}>Cancel</Button>
      </span>
    </Form>
  )
}
