import { useCategoriesGet } from "@entities/categories"
import { NewOperationForm } from "@features/new-operation"
import { OperationsLatest } from "@features/operations-latest"

export const NewOperation = () => {
  useCategoriesGet(true)
  return (
    <main>
      <NewOperationForm />
      <OperationsLatest/>
    </main>
  )
}
