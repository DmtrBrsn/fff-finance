import { Category } from "./categories-types";

export const getIncExpStr = (cat?: Category) => {
  if (cat===undefined) return '-';
  const isIncome = cat.isIncome
  return isIncome === false ? 'Expense' : isIncome ? 'Income' : '-';
}
