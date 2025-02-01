import { parseDate } from "@internationalized/date"
import { Dates } from "@shared/lib/utils"
import { ButtonIcon, DatePicker, NumberField } from "@shared/ui/react-aria"
import { CreateIcon } from "@shared/ui/svg"
import { FormEvent, useState } from "react"
import { Form } from "react-aria-components"
import { useBalanceAdd } from "../api"
import { BalanceAdd } from "../lib/types"

export const BalanceForm = () => {
  const { mutateAsync: add, isPending: adding } = useBalanceAdd()
  const [values, setValues] = useState<BalanceAdd>({ sum: 0, date: Dates.now() })
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await add(values)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <span className="flex-row gap-1 align-end">
        <NumberField
          label='Sum'
          size={6}
          name="balanceSum"
          value={values.sum}
          onChange={(sum) => setValues({ ...values, sum })}
          buttons={false}
          isRequired
        />
        <DatePicker
          label='Date'
          name="balanceDate"
          value={parseDate(values.date)}
          onChange={(d) => d && setValues({ ...values, date: Dates.removeTimeFromString(d.toString()) })}
          maxValue={parseDate(Dates.now())}
          isRequired
        />
        <ButtonIcon type="submit" size="l" isPending={adding}><CreateIcon /></ButtonIcon>
      </span>
    </Form>
  )
}
