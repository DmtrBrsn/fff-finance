import { toast } from "@features/toaster"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GetPlanParams, Plan } from "../lib"
import { addPlan, deletePlan, getPlans, updatePlan } from "./plans.api"

export const QUERY_KEY_PLANS = 'PLANS' as const

export function usePlansGet(params: GetPlanParams, enabled = true) {
  const { isPending, isFetching, isError, data, error, refetch } = useQuery({
    queryKey: [QUERY_KEY_PLANS, params],
    queryFn: () => getPlans(params),
    enabled,
    staleTime: Infinity,
    retry: 2,
  })
  return { isPending, isFetching, isError, data, error, refetch }
}

export function usePlansAdd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addPlan,
    onSuccess: (added) => {
      const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_PLANS] })
      for (const query of queries) {
        const params = query[0][1] as GetPlanParams
        if (params?.noDate && added.dateStart !== undefined) {
          continue
        }
        queryClient.setQueryData<Plan[]>(
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

export function usePlansUpdate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updatePlan,
    onSuccess: (updated) => {
      const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_PLANS] })
      for (const query of queries) {
        const params = query[0][1] as GetPlanParams
        if (params?.noDate && updated.dateStart !== undefined) {
          queryClient.setQueryData<Plan[]>(
            query[0],
            cache =>
              cache?.filter(op => op.id !== updated.id)
          )
        }
        queryClient.setQueryData<Plan[]>(
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

export function usePlansDelete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePlan,
    onSuccess: (id) => {
      const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_PLANS] })
      for (const query of queries) {
        queryClient.setQueryData<Plan[]>(
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
