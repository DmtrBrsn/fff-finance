import { OperationAdd } from "./operations.types"

const opDraftKey = 'operationDraft'

export const getOpDraft = () => {
  const value = sessionStorage.getItem(opDraftKey)
  if (value == null) return null
  let parsedObj = JSON.parse(value)
  return parsedObj as OperationAdd
}

export const updateOpDraft = (newValues: OperationAdd) => {
  sessionStorage.setItem(opDraftKey, JSON.stringify(newValues))
}

export const removeOpDraft = () => sessionStorage.removeItem(opDraftKey)
