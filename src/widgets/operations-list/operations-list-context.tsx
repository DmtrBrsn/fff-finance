import { ReactNode, createContext, useContext, useState } from "react"
import { GetOpsDatesParams, getOpListParamsFromSs, getThisMonthOpParams } from "@entities/operations"

type OpsContextValue = {
  params: GetOpsDatesParams
  setParams: React.Dispatch<React.SetStateAction<GetOpsDatesParams>> | null
}

export const OpsListContext = createContext<OpsContextValue>(
  { params: getOpListParamsFromSs() ?? getThisMonthOpParams(), setParams: null }
)

export function useOpsListContext() {
  return useContext(OpsListContext)
}

export const OpsListProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [params, setParams] = useState(getOpListParamsFromSs() ?? getThisMonthOpParams())

  return (
    <OpsListContext.Provider
      value={{params, setParams}}
    >
      {children}
    </OpsListContext.Provider>
  )
}
