import { OperationAdd } from "@entities/operations"
import { addTsInstanseToParsedJson } from "@shared/utils"


const opDraftKey = 'operationDraft'

export const getOpDraft = () => {
  const value = localStorage.getItem(opDraftKey)
  if (value == null) return null
  let parsedObj = JSON.parse(value)
  parsedObj = addTsInstanseToParsedJson(parsedObj, 'date')
  return parsedObj as OperationAdd
}

export const updateOpDraft = (newValues: OperationAdd) => {
  localStorage.setItem(opDraftKey, JSON.stringify(newValues))
}

export const removeOpDraft = () => localStorage.removeItem(opDraftKey)
