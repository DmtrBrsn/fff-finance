import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Operation } from "..";
import { toast } from "react-toastify";
import { addOperation, deleteOperation, getAllOperations, updateOperation } from "./operations.api";

export const QUERY_KEY_OPERATIONS = 'OPERATIONS' as const

export function useOperationsGet(enabled: boolean) {
  const { isPending, isFetching, isError, data, error } = useQuery({
    queryKey: [QUERY_KEY_OPERATIONS],
    queryFn: getAllOperations,
    enabled
  })
  return { isPending, isFetching, isError, data, error }
}

export function useOperationsAdd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addOperation,
    onSuccess: (op, { onSuccess }) => {
      onSuccess && onSuccess()
      queryClient.setQueryData<Operation[]>(
				[QUERY_KEY_OPERATIONS],
				cache => cache ? [...cache, op] : [op]
			)
    },
    onError: (err, { onFail }) => {
      onFail && onFail()
      toast.error(err.message)
      console.error(err)
    }
  })
}

export function useOperationsUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateOperation,
    onSuccess: (updatedOp, { onSuccess }) => {
      onSuccess && onSuccess()
      queryClient.setQueryData<Operation[]>(
				[QUERY_KEY_OPERATIONS],
				cache =>
					cache?.map(op => op.id === updatedOp.id ? {...op, ...updatedOp} : op)
			)
    },
    onError: (err, { onFail }) => {
      onFail && onFail()
      toast.error(err.message)
      console.error(err)
    }
  })
}

export function useOperationsDelete() { 
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteOperation,
    onSuccess: (id, { onSuccess }) => {
      onSuccess && onSuccess()
      queryClient.setQueryData<Operation[]>(
				[QUERY_KEY_OPERATIONS],
				cache => cache?.filter(op => op.id !== id)
			)
    },
    onError: (err, { onFail }) => {
      onFail && onFail()
      toast.error(err.message)
      console.error(err)
    }
  })
}
