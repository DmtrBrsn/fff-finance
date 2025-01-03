import { toast } from "@features/toaster"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GetPlanParams, Plan, PlanUtils } from "../lib"
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
      const planRecType = PlanUtils.getPlanRecType(added)
      for (const query of queries) {
        const params = query[0][1] as GetPlanParams
        if (params.type !== planRecType) continue
        const regularPlanNotInQuery = (
          params.type === 'regular' &&
          added.dateStart && params.from && params.to &&
          (added.dateStart < params.from || added.dateStart > params.to)
        )
        if (regularPlanNotInQuery) continue
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
      const planRecType = PlanUtils.getPlanRecType(updated)

      for (const query of queries) { 
        const params = query[0][1] as GetPlanParams
        const regularPlanNotInQuery = (
          params.type === 'regular' &&
          updated.dateStart && params.from && params.to &&
          (updated.dateStart < params.from || updated.dateStart > params.to)
        )
        if (params.type !== planRecType || regularPlanNotInQuery) {
          queryClient.setQueryData<Plan[]>(
            query[0],
            cache =>
              cache?.filter(p => p.id !== updated.id)
          )
          continue
        }
        const data = queryClient.getQueryData(query[0]) as Plan[]
        const existingPlan = data?.find(p => p?.id === updated.id)
        queryClient.setQueryData<Plan[]>(
          query[0],
          cache => 
            existingPlan==undefined ?
              cache?.map(p => p.id === updated.id ? { ...p, ...updated } : p)
              :
              cache ? [...cache, {...existingPlan, ...updated}] : [{...existingPlan, ...updated}]
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
