
import { Breadcrumb, Breadcrumbs, Link } from "react-aria-components"
import { useCategoriesGet } from '../entities/categories/api'
import { NewOperationForm } from '../entities/operations/ui'
import { OperationsLatest } from '../entities/operations/ui/operations-latest'

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
        <OperationsLatest />
      </div>
    </main>
  )
}
