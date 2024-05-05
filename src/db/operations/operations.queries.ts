import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Operation } from "..";
import { toast } from "react-toastify";
import { addOperation, deleteOperation, getOperations, updateOperation } from "./operations.api";
import { GetOpsParams } from "./operations-params";

export const QUERY_KEY_OPERATIONS = 'OPERATIONS' as const

export function useOperationsGet(params: GetOpsParams,  enabled=false) {
  const { isPending, isFetching, isError, data, error, refetch } = useQuery({
    queryKey: [QUERY_KEY_OPERATIONS, params],
    queryFn: ()=>getOperations(params),
    enabled,
    staleTime: Infinity
  })
  return { isPending, isFetching, isError, data, error, refetch }
}

export function useOperationsAdd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addOperation,
    onSuccess: (op) => {
      const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_OPERATIONS] })
      for (const query of queries) {
        let params = query[0][1] as GetOpsParams
        if (
          params?.from != undefined && params?.to != undefined &&
          (op.date.seconds < params?.from.seconds || op.date.seconds > params?.to.seconds)) {
          continue
        }
        queryClient.setQueryData<Operation[]>(
          query[0],
          cache => cache ? [...cache, op] : [op]
        )
      }
    },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    }
  })
}

export function useOperationsUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateOperation,
    onSuccess: (updatedOp) => {
      const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_OPERATIONS] })
      for (const query of queries) {
        queryClient.setQueryData<Operation[]>(
          query[0],
          cache =>
            cache?.map(op => op.id === updatedOp.id ? {...op, ...updatedOp} : op)
        )
      }
    },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    }
  })
}

export function useOperationsDelete() { 
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteOperation,
    onSuccess: (id) => {
      const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_OPERATIONS] })
      for (const query of queries) {
        queryClient.setQueryData<Operation[]>(
          query[0],
          cache => cache?.filter(op => op.id !== id)
        )
      }
    },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    }
  })
}
