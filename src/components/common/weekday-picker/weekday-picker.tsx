import { useEffect, useState } from "react"
import { Weekdays, weekdays } from "../../../db/operations/operation-constants"
import './weekday-picker.style.css'

export const WeekdayPicker = ({ value, onChange, persistValue }: { value: Weekdays[], onChange: (newValue: Weekdays[]) => void, persistValue?: Weekdays[] }) => {
  const initialValue = persistValue ? [...new Set([...value, ...persistValue])] : value
  const [wd, setWd] = useState(initialValue)
  const isSelected = (w: Weekdays) => wd.includes(w)
  const handleClick = (w: Weekdays) => {
    if (persistValue && persistValue.includes(w)) return
    const newWd = isSelected(w) ? wd.filter(w1 => w1 !== w) : [...wd, w]
    setWd(newWd)
    onChange(newWd)
  }

  useEffect(()=>setWd(value), [value])

  return (
    <div className="weekday-picker">
      {
        weekdays.map(w =>
          <span
            key={w}
            onClick={() => handleClick(w)}
            className={'item' + (isSelected(w) ? ' selected' : '')}
          >
            {w}
          </span>
        )
      }
    </div>
  )
}
