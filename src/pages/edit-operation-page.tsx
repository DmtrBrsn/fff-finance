import { useCategoriesGet } from "@features/categories/api"
import { useOperationsGet } from "@features/operations/api"
import { EditOperationForm } from "@features/operations/ui"
import { Breadcrumb, Breadcrumbs, Link } from "react-aria-components"
import { useNavigate, useParams } from "react-router-dom"

export const EditOperationPage = () => {
  useCategoriesGet(true)
  const { id } = useParams()
  const { data: ops, isPending } = useOperationsGet({ id }, id !== undefined)
  const navigate = useNavigate()

  return (
    <main >
      <div className="flex-col gap-3 max-width-wrap">
        <Breadcrumbs>
          <Breadcrumb>
            <Link href="/operations">Operations</Link>
          </Breadcrumb>
          <Breadcrumb>
            <Link href={`/operations/${id}`}>Edit</Link>
          </Breadcrumb>
        </Breadcrumbs>
        {isPending ? <p>Loading...</p> :
          ops?.length === 0 || !ops ? <p>Operation not found</p> :
            <EditOperationForm op={ops[0]} onSuccess={() => navigate('/operations')} />
        }
      </div>
    </main>
  )
}
