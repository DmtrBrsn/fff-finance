import { OperationAdd } from "@entities/operations"
import {
  RecurrentOpSettings, RecurrentOpSettingsAdd,
  RecurrentOpSettingsUpd, RepeatEvery, repeatEvery,
  Weekdays, weekdays
} from "@entities/recurrent-op-settings"
import { getDay } from "date-fns"
import { DatePicker, NumberField, RadioGroup, Switch, Tag, TagGroup } from "@shared/react-aria"
import { Radio } from "react-aria-components"
import { parseDate } from "@internationalized/date"
import { DateUtils } from "@shared/utils"
import './recurrent-op-setup.css'

type RosSetupProps = {
  op: OperationAdd
  ros: RecurrentOpSettings | RecurrentOpSettingsAdd | RecurrentOpSettingsUpd
  setRos: React.Dispatch<React.SetStateAction<
    RecurrentOpSettings | RecurrentOpSettingsAdd | RecurrentOpSettingsUpd>
  >
}

export const RecurrentOpSetup = ({ op, ros, setRos }: RosSetupProps) => {
  return (
    <div className="recurrent-op-setup-container">
      <Switch
        isSelected={Boolean(ros.every)}
        onChange={() => setRos({ ...ros, every: ros.every ? undefined : 'day' })}
      >Recurrent</Switch>
      {ros.every && <>
        <NumberField
          minValue={1}
          size={1}
          label="Every"
          value={ros.everyNumber}
          onChange={(e) => setRos({ ...ros, everyNumber: e })}
        />
        <RadioGroup
          orientation="horizontal"
          onChange={(e) => setRos({ ...ros, every: e==='off' ? undefined : e as RepeatEvery })}
          value={ros.every ?? undefined}
        >
          {repeatEvery.map(e => <Radio key={e} value={e}>{e}</Radio>)}
        </RadioGroup>
        {ros.every === 'week' &&
          <TagGroup
            label="On following weekdays"
            selectionMode="multiple"
            items={weekdays.map(w => ({ name: w, key: w }))}
            defaultSelectedKeys={[weekdays[getDay(op.date)]]}
            disabledKeys={[weekdays[getDay(op.date)]]}
            onSelectionChange={
              (sel) => setRos({ ...ros, weekdays: [...sel].map(s => s.toString() as Weekdays) })
            }
          >{(item) => <Tag>{item.name}</Tag>}</TagGroup>
        }
        <RadioGroup
          value={ros.useTimes ? 'useTimes' : 'useEnds'}
          orientation="horizontal"
          onChange={(e) => setRos({ ...ros, useTimes: e === 'useTimes' })}
        >
          <Radio value='useTimes'>Ends after</Radio>
          <Radio value='useEnds'>Ends on</Radio>
        </RadioGroup>
        {ros.useTimes ?
          <NumberField
            label="Times"
            minValue={1}
            size={1}
            value={ros.times}
            onChange={(e) => setRos({ ...ros, times: e })}
          />
          :
        <DatePicker
          label={'Date'}
          value={ros.endsOn ? parseDate(ros.endsOn) : undefined}
            onChange={
              e => setRos({ ...ros, endsOn: e ? DateUtils.isoStrToInpDate(e.toString()) : undefined })
            }
          />
        }</>
      }
    </div>
  )
}
