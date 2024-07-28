import { formatISO, getDay } from "date-fns"
import { WeekdayPicker } from "../weekday-picker/weekday-picker"
import { Timestamp } from "firebase/firestore"
import { OperationAdd } from "@entities/operations"
import { RecurrentOpSettings, RecurrentOpSettingsAdd, RepeatEvery, repeatEvery, weekdays } from "@entities/recurrent-op-settings"
import './recurrent-op-setup.style.css'

type RecurrentOpSetupProps = {
  op: OperationAdd
  repeatOptions: RecurrentOpSettings | RecurrentOpSettingsAdd
  setRepeatOptions: React.Dispatch<React.SetStateAction<RecurrentOpSettings | RecurrentOpSettingsAdd>>
}

export const RecurrentOpSetup = (props: RecurrentOpSetupProps) => {

  const { op, repeatOptions: options, setRepeatOptions: setOptions } = props
  
  return (
    <div className="recurrent-op-setup-container">
      <label>Repeat{options.every &&  ' every'}</label>
      {
        options.every &&
          <input
            type="number"
            min="1"
            step="1"
            value={options.everyNumber}
            onChange={(e) => setOptions({ ...options, everyNumber: parseInt(e.target.value) })}
          />
      }
      <select
        value={options.every ?? 'off'}
        onChange={(e) => {
          const every = e.target.value === 'off' ? undefined : e.target.value as RepeatEvery
          setOptions({...options, every})
        }}
      >
        <option key='off'>off</option>
        {repeatEvery.map(e => <option key={e}>{e}</option>)}
      </select>
      {options.every === 'week' &&
        <WeekdayPicker
          value={options.weekdays ?? []}
          onChange={(weekdays) => setOptions({ ...options, weekdays })}
          persistValue={[weekdays[getDay(op.date.toDate())]]}
        />
      }
      {
        options.every &&
        <>
          <label>Ends</label>
          <label>After</label>
          <input
            type="radio"
            name="useTimes"
            value='useTimes'
            checked={options.useTimes}
            onChange={(e) => setOptions({ ...options, useTimes: e.target.checked })}
          />
          <input
            type="number"
            disabled={!options.useTimes}
            min="1"
            step="1"
            value={options.times}
            onChange={(e) => setOptions({ ...options, times: parseInt(e.target.value) })} />
          <label>On</label>
          <input
            type="radio"
            name="useTimes"
            value='useTimes'
            checked={!options.useTimes}
            onChange={(e) => setOptions({ ...options, useTimes: !e.target.checked })}
          />
          
          <input
            type="date"
            disabled={options.useTimes}
            value={options.endsOn && formatISO(options.endsOn.toDate(), {representation: 'date'})}
            min={formatISO(op.date.toDate(), {representation: 'date'})}
            onChange={(e) => setOptions({...options, endsOn: Timestamp.fromDate(new Date(e.target.value))})}
          />
        </>
      }
    </div>
  )
}
