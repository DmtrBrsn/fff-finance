import { toast } from "@features/toaster"
import { DateUtils } from "@shared/lib/utils"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Operation } from "../lib"
import { GetOpsParams } from "./operations-params"
import { addOperation, batchAddOperations, batchDeleteOperations, batchUpdateOperations, deleteOperation, getOperation, getOperations, updateOperation } from "./operations.api"

export const QUERY_KEY_OPERATIONS = 'OPERATIONS' as const

export function useOperationsGet(params: GetOpsParams, enabled = false) {
  const { isPending, isFetching, isError, data, error, refetch } = useQuery({
    queryKey: [QUERY_KEY_OPERATIONS, params],
    queryFn: params.id !== undefined ? () => getOperation(params.id!) : () => getOperations(params),
    enabled,
    staleTime: Infinity,
    retry: 2,
  })
  return { isPending, isFetching, isError, data, error, refetch }
}

export function useOperationsAdd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addOperation,
    onSuccess: (added) => {
      const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_OPERATIONS] })
      for (const query of queries) {
        const params = query[0][1] as GetOpsParams
        const singleIdquery = params.id !== undefined
        const opNotInQueryPeriod = params?.from != undefined && params?.to != undefined &&
          (DateUtils.isoStrToTime(added.date) < DateUtils.isoStrToTime(params.from) ||
            DateUtils.isoStrToTime(added.date) > DateUtils.isoStrToTime(params.to))
        if (opNotInQueryPeriod || singleIdquery) {
          continue
        }
        queryClient.setQueryData<Operation[]>(
          query[0],
          cache => cache ? [...cache, added] : [added]
        )
      }
    },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    }
  })
}

export function useOperationsBatchAdd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: batchAddOperations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_OPERATIONS] })
    },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    }
  })
}

export function useOperationsBatchUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: batchUpdateOperations,
    onSuccess: (updDocs) => {
      const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_OPERATIONS] })
      for (const query of queries) {
        queryClient.setQueryData<Operation[]>(
          query[0],
          cache => cache?.map(op => {
            const updatedOp = updDocs.find(d => d.id === op.id)
            return op.id === updatedOp?.id ? { ...op, ...updatedOp } : op
          })
        )
      }
    },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    }
  })
}

export function useOperationsBatchDelete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: batchDeleteOperations,
    onSuccess: (ids) => {
      const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_OPERATIONS] })
      for (const query of queries) {
        queryClient.setQueryData<Operation[]>(
          query[0],
          cache => cache?.filter(op => !ids.includes(op.id))
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
    onSuccess: (updated) => {
      const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_OPERATIONS] })
      for (const query of queries) {
        queryClient.setQueryData<Operation[]>(
          query[0],
          cache =>
            cache?.map(op => op.id === updated.id ? { ...op, ...updated } : op)
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
