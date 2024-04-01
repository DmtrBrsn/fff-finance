import { useEffect, useState } from "react"
import './strip-select.css'

type Key = number | string

type Kv = [Key, string] | []

type StripSelectEvent = {
  target: StripSelectEventTarget
}

type StripSelectEventTarget = {
  value: string | undefined,
  key: Key | undefined
}

type Props = {
  items: Kv[]
  selectedKeyByDefault?: Key
  onSelect?: (e: StripSelectEvent)=>void
}

export const StripSelect = ({ items, selectedKeyByDefault, onSelect }: Props) => {
  const selectedKeyDefValid = (
    selectedKeyByDefault !== undefined &&
    items.find(i=>i[0]===selectedKeyByDefault)!==undefined
  )

  const [selectedKey, setSelectedKey] = useState(selectedKeyDefValid ? selectedKeyByDefault : undefined)
  
  const handleClick = (kv: Kv) => {
    if (selectedKey === kv[0]) {
      setSelectedKey(undefined)
      onSelect && onSelect({ target: { value: undefined, key: undefined } })
    }
    else {
      setSelectedKey(kv[0])
      onSelect && onSelect({ target: { value: kv[1], key: kv[0] } })
    }
  }
  
  useEffect(() => {
    setSelectedKey(selectedKeyDefValid ? selectedKeyByDefault : undefined)
    return ()=>{}
  }, [selectedKeyByDefault])

  return (
    <span className="strip-select">
      {
        items.map(kv =>
            <span
              key={kv[0]}
              className={(selectedKey===kv[0] ? 'selected ' : '')+'item'}
              onClick={() => handleClick(kv)}
            >
              {kv[1]}
            </span>
          )
      }
    </span>
  )
}