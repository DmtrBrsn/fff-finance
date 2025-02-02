import { useCategoriesGet } from "@features/categories/api"
import { getPlanFromCache, usePlansGet } from "@features/plans/api"
import { PlanForm } from "@features/plans/ui"
import { Breadcrumb, Breadcrumbs, Link } from "react-aria-components"
import { useNavigate, useParams } from "react-router-dom"

export const EditPlanPage = () => {
  useCategoriesGet(true)
  const { id } = useParams()
  let plan = id ? getPlanFromCache(id) : undefined
  const { data: plans, isPending } = usePlansGet({ id }, plan == undefined)
  plan ??= plans?.find(p => p.id === id)
  const navigate = useNavigate()

  return (
    <main >
      <div className="flex-col gap-3 max-width-wrap">
        <Breadcrumbs>
          <Breadcrumb>
            <Link href="/plans">Plans</Link>
          </Breadcrumb>
          <Breadcrumb>
            <Link href={`/plans/${id}`}>Edit</Link>
          </Breadcrumb>
        </Breadcrumbs>
        {plan == undefined && isPending ? <p>Loading...</p> :
          plan == undefined ? <p>Plan not found</p> :
            <PlanForm mode="edit" plan={plan} onSuccess={() => navigate('/plans')} />
        }
      </div>
    </main>
  )
}
