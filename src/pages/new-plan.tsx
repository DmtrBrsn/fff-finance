
import { Breadcrumb, Breadcrumbs, Link } from "react-aria-components"
import { useNavigate } from "react-router-dom"
import { useCategoriesGet } from '../entities/categories/api'
import { PlanForm } from '../entities/plans/ui'

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
        <PlanForm mode="add" onSuccess={() => navigate('/plans')} />
      </div>
    </main>
  )
}
