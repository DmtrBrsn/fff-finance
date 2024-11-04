import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addCategory, deleteCategory, getAllCategories, updateCategory } from "./categories.api"

import { toast } from "@app/toaster"
import { Category } from "./categories-types"

export const QUERY_KEY_CATEGORIES = 'CATEGORIES' as const

export function useCategoriesGet(enabled: boolean = true) {
  const { isPending, isFetching, isError, data, error } = useQuery({
    queryKey: [QUERY_KEY_CATEGORIES],
    queryFn: getAllCategories,
    enabled,
    staleTime: Infinity
  })
  return { isPending, isFetching, isError, data, error }
}

export function useCategoriesAdd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addCategory,
    onSuccess: (cat) => {
      queryClient.setQueryData<Category[]>(
				[QUERY_KEY_CATEGORIES],
				cache => cache ? [...cache, cat] : [cat]
			)
    },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    }
  })
}

export function useCategoriesUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (updatedCat) => {
      queryClient.setQueryData<Category[]>(
				[QUERY_KEY_CATEGORIES],
				cache =>
					cache?.map(cat => cat.id === updatedCat.id ? {...cat, ...updatedCat} : cat)
			)
    },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    }
  })
}

export function useCategoriesDelete() { 
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (id) => {
      queryClient.setQueryData<Category[]>(
				[QUERY_KEY_CATEGORIES],
				cache => cache?.filter(cat => cat.id !== id)
			)
    },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    }
  })
}
