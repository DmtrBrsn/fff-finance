import { useCategoriesGet } from "@features/categories/api"
import { NewOperationForm } from "@features/operations/ui"
import { OperationsLatest } from "@features/operations/ui/operations-latest"
import { Breadcrumb, Breadcrumbs, Link } from "react-aria-components"

export const NewOperation = () => {
  useCategoriesGet(true)
  return (
    <main >
      <div className="flex-col gap-3 max-width-wrap">
        <Breadcrumbs>
          <Breadcrumb>
              <Link href="/operations">Operations</Link>
          </Breadcrumb>
          <Breadcrumb>
            <Link href="/operations/new">New</Link>
          </Breadcrumb>
        </Breadcrumbs>
        <NewOperationForm />
        <OperationsLatest/>
      </div>
    </main>
  )
}
