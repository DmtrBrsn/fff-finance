import { OpsListProvider } from "../widgets/operations-list-context";
import { OperationsList } from "../widgets/operations-list/operations-list";
import { OperationsListToolBar } from "../widgets/operations-toolbar/operations-toolbar";

export const OperationsPage = () => (
  <main>
    <OpsListProvider>
      <OperationsListToolBar />
      <OperationsList />
    </OpsListProvider>
  </main>

)
