import { useCategoriesGet } from "@entities/categories"
import { NewOperationForm } from "@features/operation-form"
import { OperationsLatest } from "@features/operations-latest"

export const NewOperation = () => {
  useCategoriesGet(true)
  return (
    <main >
      <div className="max-width-wrap">
        <NewOperationForm />
        <OperationsLatest/>
      </div>
    </main>
  )
}
