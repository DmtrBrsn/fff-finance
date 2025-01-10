import { CatForm } from "@features/categories/ui/categories-form"
import { Breadcrumb, Breadcrumbs, Link } from "react-aria-components"
import { useNavigate } from "react-router-dom"

export const NewCategory = () => {
  const navigate = useNavigate()
  return (
    <main >
      <div className="flex-col gap-3 max-width-wrap">
        <Breadcrumbs>
          <Breadcrumb>
            <Link href="/categories">Categories</Link>
          </Breadcrumb>
          <Breadcrumb>
            <Link href="/categories/new">New</Link>
          </Breadcrumb>
        </Breadcrumbs>
        <CatForm mode="add" onSuccess={() => navigate('/categories')} />
      </div>
    </main>
  )
}
