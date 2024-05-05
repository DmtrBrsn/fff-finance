import { NewOperationForm } from "../widgets/new-operation/new-operation-form"
import { OperationLatest } from "../widgets/operations-latest"

export const NewOperation = () => {
  return (
    <main className="page-centered-content">
      <NewOperationForm />
      <OperationLatest/>
    </main>
  )
}
