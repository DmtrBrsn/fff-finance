import { ReactNode } from "react"
import { Spinner } from "../../common/spinner"

export const OpTable = ({children}: {children: ReactNode}) => {
  return (
    <table>
      <thead><tr>
        <th>Date</th>
        <th>Description</th>
        <th>Sum</th>
        <th>Category</th>
        <th>isIncome</th>
        <th>isPlan</th>
      </tr></thead>
      <tbody>{children}</tbody>
    </table>
  )
}

export const SpinnerCell = () => <td><Spinner /></td>
