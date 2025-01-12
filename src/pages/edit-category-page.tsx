import { useCategoriesGet } from "@features/categories/api"
import { CatForm } from "@features/categories/ui/cat-form"
import { Breadcrumb, Breadcrumbs, Link } from "react-aria-components"
import { useNavigate, useParams } from "react-router-dom"

export const EditCategoryPage = () => {
  const { data: cats, isPending } = useCategoriesGet(true)
  const { id } = useParams()
  const cat = cats?.find(cat => cat.id === id)
  const navigate = useNavigate()

  return (
    <main >
      <div className="flex-col gap-3 max-width-wrap">
        <Breadcrumbs>
          <Breadcrumb>
            <Link href="/categories">Categories</Link>
          </Breadcrumb>
          <Breadcrumb>
            <Link href={`/categoties/${id}`}>Edit</Link>
          </Breadcrumb>
        </Breadcrumbs>
        {isPending ? <p>Loading...</p> :
          !cat ? <p>Category not found</p> :
            <CatForm mode="edit" cat={cat} onSuccess={() => navigate('/categories')} />
        }
      </div>
    </main>
  )
}
