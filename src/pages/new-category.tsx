import { CatForm } from "@features/categories/ui/categories-form"
import { useNavigate } from "react-router-dom"

export const NewCategory = () => {
  const navigate = useNavigate()
  return (
    <main >
      <div className="flex-col gap-3 max-width-wrap">
        <h2>New Category</h2>
        <CatForm mode="add" onSuccess={() => navigate('/categories')} />
      </div>
    </main>
  )
}
