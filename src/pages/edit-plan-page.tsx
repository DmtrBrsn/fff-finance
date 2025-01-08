import { useCategoriesGet } from "@features/categories/api"
import { usePlansGet } from "@features/plans/api"
import { PlanForm } from "@features/plans/ui"
import { Breadcrumb, Breadcrumbs, Link } from "react-aria-components"
import { useNavigate, useParams } from "react-router-dom"

export const EditPlanPage = () => {
  useCategoriesGet(true)
  const { id } = useParams()
  const { data: plans, isPending } = usePlansGet({ id }, id !== undefined)
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
        {isPending ? <p>Loading...</p> :
          plans?.length === 0 || !plans ? <p>Plan not found</p> :
            <PlanForm mode="edit" plan={plans[0]} onSuccess={() => navigate('/plans')} />
        }
      </div>
    </main>
  )
}
