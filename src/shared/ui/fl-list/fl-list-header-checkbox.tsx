
import { Id } from '../../lib/types/api-types'
import { Checkbox } from '../react-aria'


export const ListHeaderCheckBox = <T extends Record<string, any> & { id: Id }>(
  { data, selected, setSelected }: { data: T[], selected: Id[], setSelected: (ids: Id[]) => void }
) => {

  const handleChange = (e: boolean) => {
    setSelected(e ? data.map(i => i.id) || [] : [])
  }

  return <Checkbox
    isSelected={selected.length > 0 && selected.length === data.length}
    onChange={handleChange}
    isIndeterminate={selected.length > 0 && selected.length < data.length}
  />
}
