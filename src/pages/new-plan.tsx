import { useCategoriesGet } from "@features/categories/api"
import { PlanForm } from "@features/plans/ui"
import { Breadcrumb, Breadcrumbs, Link } from "react-aria-components"
import { useNavigate } from "react-router-dom"

export const NewPlan = () => {
  useCategoriesGet(true)
  const navigate = useNavigate()
  return (
    <main >
      <div className="flex-col gap-3 max-width-wrap">
        <Breadcrumbs>
          <Breadcrumb>
            <Link href="/plans">Plans</Link>
          </Breadcrumb>
          <Breadcrumb>
            <Link href="/plans/new">New</Link>
          </Breadcrumb>
        </Breadcrumbs>
        <h2>New Plan</h2>
        <PlanForm mode="add" onSuccess={() => navigate('/plans')} />
      </div>
    </main>
  )
}
