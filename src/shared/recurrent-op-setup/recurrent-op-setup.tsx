import { OperationAdd } from "@entities/operations"
import { RecurrentOpSettings, RecurrentOpSettingsAdd, RecurrentOpSettingsUpd, RepeatEvery, repeatEvery, Weekdays, weekdays } from "@entities/recurrent-op-settings"
import { getDay } from "date-fns"
import { DatePicker, NumberField, RadioGroup, Switch, Tag, TagGroup } from "@shared/react-aria"
import { Radio } from "react-aria-components"
import { parseDate } from "@internationalized/date"
import { DateUtils } from "@shared/utils"
import './recurrent-op-setup.css'

type RecurrentOpSetupProps = {
  op: OperationAdd
  repeatOptions: RecurrentOpSettings | RecurrentOpSettingsAdd | RecurrentOpSettingsUpd
  setRepeatOptions: React.Dispatch<React.SetStateAction<RecurrentOpSettings | RecurrentOpSettingsAdd | RecurrentOpSettingsUpd>>
}

export const RecurrentOpSetup = (props: RecurrentOpSetupProps) => {
  const { op, repeatOptions: options, setRepeatOptions: setOptions } = props
  return (
    <div className="recurrent-op-setup-container">
      <Switch isSelected={Boolean(options.every)} onChange={() => setOptions({ ...options, every: options.every ? undefined : 'day' })}>Repeat</Switch>
      {options.every &&
        <>
          <NumberField minValue={1} size={1} label="Every" value={options.everyNumber} onChange={(e) => setOptions({ ...options, everyNumber: e })}/>
          <RadioGroup
            orientation="horizontal"
            onChange={(e) => setOptions({ ...options, every: e==='off' ? undefined : e as RepeatEvery })}
            value={options.every ?? undefined}
          >
            {repeatEvery.map(e => <Radio key={e} value={e}>{e}</Radio>)}
          </RadioGroup>
          {options.every === 'week' &&
            <TagGroup
              label="On following weekdays"
              selectionMode="multiple"
              items={weekdays.map(w => ({ name: w, key: w }))}
              defaultSelectedKeys={[weekdays[getDay(op.date)]]}
              disabledKeys={[weekdays[getDay(op.date)]]}
              onSelectionChange={(sel) => setOptions({ ...options, weekdays: [...sel].map(s => s.toString() as Weekdays) })}
            >{(item) => <Tag>{item.name}</Tag>}</TagGroup>
          }
          <RadioGroup value={options.useTimes ? 'useTimes' : 'useEnds'} orientation="horizontal" onChange={(e) => setOptions({ ...options, useTimes: e === 'useTimes' })}>
            <Radio value='useTimes'>Ends after</Radio>
            <Radio value='useEnds'>Ends on</Radio>
          </RadioGroup>
          {options.useTimes ?
            <NumberField minValue={1} size={1} label="Times" value={options.times} onChange={(e) => setOptions({ ...options, times: e })} />
            :
            <DatePicker label={'Date'} value={options.endsOn ? parseDate(options.endsOn) : undefined} onChange={e=>setOptions({...options, endsOn: e ? DateUtils.isoStrToInpDate(e.toString()) : undefined})} />
          }
        </>
      }
    </div>
  )
}
