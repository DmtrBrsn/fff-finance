import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addCategory, batchUpdateCategories, deleteCategory, getAllCategories, updateCategory } from "./categories.api"

import { toast } from "@app/toaster"
import { Category } from "./categories-types"
import { orderCats } from "./categories.utils"

export const QUERY_KEY_CATEGORIES = 'CATEGORIES' as const

export function useCategoriesGet(enabled: boolean = true) {
  const { isPending, isFetching, isError, data, error } = useQuery({
    queryKey: [QUERY_KEY_CATEGORIES],
    queryFn: getAllCategories,
    enabled,
    staleTime: Infinity,
    select: (cats) => orderCats(cats)
  })
  return { isPending, isFetching, isError, data, error }
}

export function useCategoriesAdd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addCategory,
    onSuccess: (added) => {
      queryClient.setQueryData<Category[]>(
        [QUERY_KEY_CATEGORIES],
        cache => cache ? [...cache, added] : [added]
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
    onSuccess: (updated) => {
      queryClient.setQueryData<Category[]>(
        [QUERY_KEY_CATEGORIES],
        cache =>
          cache?.map(cat => cat.id === updated.id ? { ...cat, ...updated } : cat)
      )
    },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    }
  })
}

export function useCategoriesBatchUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: batchUpdateCategories,
    onSuccess: (updDocs) => {
      queryClient.setQueryData<Category[]>(
        [QUERY_KEY_CATEGORIES],
        cache => cache?.map(c => {
          const updated = updDocs.find(d => d.id === c.id)
          return c.id === updated?.id ? { ...c, ...updated } : c
        })
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
