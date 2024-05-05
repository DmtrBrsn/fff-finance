import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCategory, deleteCategory, getAllCategories, updateCategory } from "./categories.api";
import { Category } from "..";
import { toast } from "react-toastify";
import { QUERY_KEY_OPERATIONS } from "../operations";

export const QUERY_KEY_CATEGORIES = 'CATEGORIES' as const

export function useCategoriesGet(enabled: boolean) {
  const { isPending, isFetching, isError, data, error } = useQuery({
    queryKey: [QUERY_KEY_CATEGORIES],
    queryFn: getAllCategories,
    enabled
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_OPERATIONS] })
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
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_OPERATIONS] })
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
