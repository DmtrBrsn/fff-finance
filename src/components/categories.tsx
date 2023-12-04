import { useState, useEffect } from 'react'
import { db } from "../firebase";
import { getDocs, collection } from 'firebase/firestore';

export const Categories = () => {
  const [categories, setCategories] = useState<CategoryDoc[]>([])

  const categoriesCollectionRef = collection(db, 'categories')

  useEffect(() => {
    const getCollections = async () => {
      try {
        const data = await getDocs(categoriesCollectionRef)
        const filtered: CategoryDoc[] = data.docs.map(doc=> {
          const { name, isIncome } = doc.data()

          return {
            id: doc.id,
            name,
            isIncome,
          }
        })
        setCategories(filtered)
      }
      catch(err) {
        console.log(err)
      }
    }
    getCollections()
  }, [])

  return (
    <>
      <ul>
        {categories.map(cat => <li key={cat.id}>{cat.name}</li>)}
      </ul>
    </>
  )
}