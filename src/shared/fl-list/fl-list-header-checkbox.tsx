import {useRef} from "react"
import { Id } from "@shared/types/api-types"

export const ListHeaderCheckBox = <T extends Record<string, any> & { id: Id }>(
  { data, selected, setSelected }: { data: T[], selected: Id[], setSelected: (ids: Id[]) => void }
) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(e.target.checked ? data.map(i => i.id) || [] : [])
  }
  const ref = useRef<HTMLInputElement>(null)
  if (ref.current) {
    ref.current.indeterminate = (selected.length > 0 && selected.length < data.length)
  }
  
  return <input
      ref={ref} type="checkbox"
      checked={selected.length === data.length}
      onChange={handleChange}/>
}
