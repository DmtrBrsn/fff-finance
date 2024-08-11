import { OpsListProvider, OperationsList } from "@widgets/operations-list";

export const OperationsPage = () => (
  <main>
    <OpsListProvider>
      <OperationsList />
    </OpsListProvider>
  </main>

)
