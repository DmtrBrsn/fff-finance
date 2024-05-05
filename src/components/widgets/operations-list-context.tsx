import { ReactNode, createContext, useContext, useState } from "react"
import { GetOpsDatesParams, getOpDatesParamsFromSs, getThisMonthOpParams } from "../../db/operations/operations-params"

type OpsContextValue = {
  params: GetOpsDatesParams
  setParams: React.Dispatch<React.SetStateAction<GetOpsDatesParams>> | null
}


export const OpsListContext = createContext<OpsContextValue>(
  { params: getOpDatesParamsFromSs() ?? getThisMonthOpParams(), setParams: null }
)

export function useOpsListContext() {
  return useContext(OpsListContext)
}

export const OpsListProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [params, setParams] = useState(getOpDatesParamsFromSs() ?? getThisMonthOpParams())

  return (
    <OpsListContext.Provider
      value={{params, setParams}}
    >
      {children}
    </OpsListContext.Provider>
  )
}
