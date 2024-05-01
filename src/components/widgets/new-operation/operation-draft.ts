import { OperationAdd } from "../../../db"

const opDraftKey = 'operationDraft'
export const getOpDraft = () => localStorage.getItem(opDraftKey)
export const updateOpDraft = (newValues: OperationAdd) => {
  localStorage.setItem(opDraftKey, JSON.stringify(newValues))
}
export const removeOpDraft = () => localStorage.removeItem(opDraftKey)
