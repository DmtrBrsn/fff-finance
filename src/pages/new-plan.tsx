import { useCategoriesGet } from "@features/categories/api"
import { PlanForm } from "@features/plans/ui"
import { useNavigate } from "react-router-dom"

export const NewPlan = () => {
  useCategoriesGet(true)
  const navigate = useNavigate()
  return (
    <main >
      <div className="flex-col gap-3 max-width-wrap">
        <h2>New Plan</h2>
        <PlanForm mode="add" onSuccess={() => navigate('/plans')} />
      </div>
    </main>
  )
}
