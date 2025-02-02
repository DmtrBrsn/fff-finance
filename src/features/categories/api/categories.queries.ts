import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addCategory, batchUpdateCategories, deleteCategory, getAllCategories, updateCategory } from "./categories.api"

import { toast } from "@features/toaster"
import type { Id } from '@shared/lib/types/api-types'
import { CatUtils } from "../lib"
import { Category } from "../lib/categories-types"

export const QUERY_KEY_CATEGORIES = 'CATEGORIES' as const

export function useCategoriesGet(enabled: boolean = true) {
  const { isPending, isFetching, isError, data, error } = useQuery({
    queryKey: [QUERY_KEY_CATEGORIES],
    queryFn: getAllCategories,
    enabled,
    staleTime: Infinity,
    select: (cats) => {
      return CatUtils.orderCats(cats)
    }
  })
  return { isPending, isFetching, isError, data, error }
}

export function getCatFromCache(id: Id) {
  const queryClient = useQueryClient()
  const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_CATEGORIES] })
  for (const query of queries) {
    const data = queryClient.getQueryData<Category[]>(query[0])
    return data?.find(p => p?.id === id)
  }
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
