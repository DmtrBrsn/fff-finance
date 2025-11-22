
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Operation } from "../lib"
import { GetOpsParams } from "./operations-params"
import { addOperation, batchAddOperations, batchDeleteOperations, batchUpdateOperations, deleteOperation, getOperation, getOperations, getOpSumsBetweenDates, updateOperation } from "./operations.api"
import { toast } from '../../../features/toaster'
import { Id } from '../../../shared/lib/types/api-types'
import { Dates } from '../../../shared/lib/utils'
import { Category } from '../../categories/lib'


export const QUERY_KEY_OPERATIONS = 'OPERATIONS' as const
export const QUERY_KEY_OP_SUMS_BETWEEN_DATES = 'OP_SUMS_BTWN_DATES' as const

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

export function getOpFromCache(id: Id) {
  const queryClient = useQueryClient()
  const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_OPERATIONS] })
  for (const query of queries) {
    const data = queryClient.getQueryData<Operation[]>(query[0])
    return data?.find(p => p?.id === id)
  }
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
          (Dates.toNum(added.date) < Dates.toNum(params.from) ||
            Dates.toNum(added.date) > Dates.toNum(params.to))
        if (opNotInQueryPeriod || singleIdquery) {
          continue
        }
        queryClient.setQueryData<Operation[]>(
          query[0],
          cache => cache != undefined ? [...cache, added] : undefined
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

export function useOpSumsBetweenDatesGet(dateStart: string, dateEnd: string, cats: Category[], enabled = false) {
  const { isPending, isFetching, isError, data, error, refetch } = useQuery({
    queryKey: [QUERY_KEY_OP_SUMS_BETWEEN_DATES, dateStart, dateEnd],
    queryFn: () => getOpSumsBetweenDates(dateStart, dateEnd, cats),
    enabled,
    staleTime: Infinity,
    retry: 2,
  })
  return { isPending, isFetching, isError, data, error, refetch }
}
