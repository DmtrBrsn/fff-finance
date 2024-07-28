import { NewOperationForm } from "@features/new-operation"
import { OperationsLatest } from "@features/operations-latest"

export const NewOperation = () => {
  return (
    <main className="page-centered-content">
      <NewOperationForm />
      <OperationsLatest/>
    </main>
  )
}
