import { getCatFromCache, useCategoriesGet } from "@features/categories/api"
import { CatForm } from "@features/categories/ui/cat-form"
import { Breadcrumb, Breadcrumbs, Link } from "react-aria-components"
import { useNavigate, useParams } from "react-router-dom"

export const EditCategoryPage = () => {
  const { id } = useParams()
  let cat = id ? getCatFromCache(id) : undefined
  const { data: cats, isPending } = useCategoriesGet(cat == undefined)
  cat ??= cats?.find(c => c.id === id)
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
        {cat == undefined && isPending ? <p>Loading...</p> :
          cat == undefined ? <p>Category not found</p> :
            <CatForm mode="edit" cat={cat} onSuccess={() => navigate('/categories')} />
        }
      </div>
    </main>
  )
}
