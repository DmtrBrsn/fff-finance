import { useCategoriesGet } from "@features/categories/api"
import { NewOperationForm } from "@features/operations/ui"
import { OperationsLatest } from "@features/operations/ui/operations-latest"

export const NewOperation = () => {
  useCategoriesGet(true)
  return (
    <main >
      <div className="flex-col gap-3 max-width-wrap">
        <h2>New operation</h2>
        <NewOperationForm />
        <OperationsLatest/>
      </div>
    </main>
  )
}
