import { parseDate } from "@internationalized/date"
import { Button, DatePicker, NumberField } from "@shared/react-aria"
import { CreateIcon } from "@shared/svg"
import { DateUtils } from "@shared/utils"
import { FormEvent, useState } from "react"
import { Form } from "react-aria-components"
import { useBalanceAdd } from "../api"
import { BalanceAdd } from "../lib/types"

export const BalanceForm = () => {
  const { mutateAsync: add, isPending: adding } = useBalanceAdd()
  const [values, setValues] = useState<BalanceAdd>({ sum: 0, date: DateUtils.getCurIsoDate() })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await add(values)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <span className="flex-row gap-1">
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
          onChange={(d) => d && setValues({ ...values, date: DateUtils.isoStrToIsoDate(d.toString()) })}
          maxValue={parseDate(DateUtils.getCurIsoDate())}
          isRequired
        />
      </span>
      <Button type="submit" variant="attention" isDisabled={adding}><CreateIcon />Add</Button>
    </Form>
  )
}
