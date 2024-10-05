import { useCategoriesGet } from "@entities/categories"
import { NewOperationForm } from "@features/new-operation-form"
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
