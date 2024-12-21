import { useCategoriesGet } from "@features/categories/api"
import { NewOperationForm } from "@features/operations/ui"
import { OperationsLatest } from "@features/operations/ui/operations-latest"

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
