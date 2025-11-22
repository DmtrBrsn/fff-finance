
import { Radio } from 'react-aria-components'
import { weekdays } from '../../../../../shared/lib/contants'
import { Weekdays } from '../../../../../shared/lib/types/common-types'
import { Dates } from '../../../../../shared/lib/utils'
import { DatePicker, NumberField, RadioGroup, Tag, TagGroup, TextField } from '../../../../../shared/ui'
import { PlanFormValues, RepeatEvery, repeatEvery } from '../../../lib'


export const PlanDateStartField = (
  { dateStart, onChange }:
    { dateStart: PlanFormValues['dateStart'], onChange: (date: PlanFormValues['dateStart']) => void }
) => {
  return (
    <DatePicker
      label={'Start date'}
      value={dateStart ?? null}
      onChange={(d) => onChange(d ?? undefined)}
      description={dateStart && Dates.isPastDay(dateStart) ? 'In the past' : undefined}
    />
  )
}

export const PlanDateEndField = (
  { dateStart, dateEnd, onChange }:
    { dateStart: PlanFormValues['dateStart'], dateEnd: PlanFormValues['dateEnd'], onChange: (date: PlanFormValues['dateEnd']) => void }
) => {
  return (
    <DatePicker
      label={'End date'}
      value={dateEnd ?? null}
      onChange={(d) => onChange(d ?? undefined)}
      minValue={dateStart}
      isRequired
    />
  )
}

export const EndTypeChooser = ({ endType, onChange }: { endType: PlanFormValues['endType'], onChange: (endType: PlanFormValues['endType']) => void }) => {

  return (
    <RadioGroup
      value={endType}
      orientation="horizontal"
      onChange={(e) => onChange(e as PlanFormValues['endType'])}
      label='Ends'
    >
      <Radio value='times'>after</Radio>
      <Radio value='date'>on</Radio>
      <Radio value='never'>never</Radio>
    </RadioGroup>
  )
}

export const PlanTimesField = (
  { times, onChange }:
    { times: number, onChange: (times: number) => void }
) => {

  return (
    <NumberField
      size={6}
      label='Occurences'
      minValue={1}
      value={times}
      onChange={onChange}
      isRequired
    />
  )
}

export const PlanRepeatEveryNumberField = (
  { everyNumber, every, onChange }:
    { everyNumber?: number, every: RepeatEvery, onChange: (everyNumber: number) => void }
) => {
  return (
    <NumberField
      size={6}
      label='Repeat every'
      value={everyNumber}
      onChange={onChange}
      minValue={1}
      isRequired
      isDisabled={everyNumber === undefined}
      description={every}
    />
  )
}

export const PlanEveryField = (
  { every, onChange, isDisabled }: { every?: PlanFormValues['every'], onChange: (every: PlanFormValues['every']) => void, isDisabled: boolean }
) => {
  return (
    <RadioGroup
      label="Repeat"
      orientation="horizontal"
      onChange={(e) => onChange(e as PlanFormValues['every'])}
      value={every}
      isDisabled={isDisabled}
    >
      <>
        <Radio key={'off'} value={'off'}>{'off'}</Radio>
        {repeatEvery.map(e => <Radio key={e} value={e}>{e}</Radio>)}
      </>
    </RadioGroup>
  )
}

export const PlanRepeatWeekSetup = (
  { selectedWeekdays, onChange }:
    { selectedWeekdays: PlanFormValues['weekdays'], onChange: (wd: PlanFormValues['weekdays']) => void }
) => {
  return (
    <TagGroup
      label="On following weekdays"
      selectionMode="multiple"
      items={weekdays.map(w => ({ name: w, key: w }))}
      selectedKeys={selectedWeekdays}
      onSelectionChange={
        (sel) => onChange([...sel].map(s => s.toString() as Weekdays))
      }
    >{(item) => <Tag>{item.name}</Tag>}</TagGroup>
  )
}

export const PlanDescriptionField = ({ description, onChange }: { description: string, onChange: (description: string) => void }) => {
  return (
    <TextField
      size={35}
      label='Description'
      name="planDescription"
      value={description}
      isRequired
      maxLength={300}
      onChange={onChange}
    />
  )
}

export const PlanSumField = ({ sum, onChange }: { sum: number, onChange: (sum: number) => void }) => {
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value
    val.length > 1 && val.startsWith('0') && onChange(Number(val.slice(1)))
  }
  return (
    <NumberField
      buttons={false}
      size={8}
      fontSize="l"
      label='Sum'
      minValue={0}
      step={0.01}
      value={sum}
      isRequired
      onInput={handleInput}
      onChange={onChange}
    />
  )
}
