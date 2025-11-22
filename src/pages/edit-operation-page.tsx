
import { Breadcrumb, Breadcrumbs, Link } from "react-aria-components"
import { useNavigate, useParams } from "react-router-dom"
import { useCategoriesGet } from '../entities/categories/api'
import { getOpFromCache, useOperationsGet } from '../entities/operations/api'
import { EditOperationForm } from '../entities/operations/ui'

export const EditOperationPage = () => {
  useCategoriesGet(true)
  const { id } = useParams()
  let op = id ? getOpFromCache(id) : undefined
  const { data: ops, isPending } = useOperationsGet({ id }, op == undefined)
  op ??= ops?.find(o => o.id === id)
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
        {op == undefined && isPending ? <p>Loading...</p> :
          op == undefined ? <p>Operation not found</p> :
            <EditOperationForm op={op} onSuccess={() => navigate('/operations')} />
        }
      </div>
    </main>
  )
}
