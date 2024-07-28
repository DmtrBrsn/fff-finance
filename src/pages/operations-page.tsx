import { OperationsListToolBar } from "@features/operations-toolbar";
import { OpsListProvider, OperationsList } from "@widgets/operations-list";

export const OperationsPage = () => (
  <main>
    <OpsListProvider>
      <OperationsListToolBar />
      <OperationsList />
    </OpsListProvider>
  </main>

)
