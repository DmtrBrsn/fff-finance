import { toast } from "@features/toaster"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GetPlanParams, Plan, PlanUtils } from "../lib"
import { addPlan, batchDeletePlans, deletePlan, getPlan, getPlans, getRegPlanSumsBetweenDates, updatePlan } from "./plans.api"
import { Category } from "@features/categories/lib"

export const QUERY_KEY_PLANS = 'PLANS' as const
export const QUERY_KEY_REG_PLAN_SUMS_BETWEEN_DATES = 'REG_PLAN_SUMS_BTWN_DATES' as const

export function usePlansGet(params: GetPlanParams, enabled = true) {
  const { isPending, isFetching, isError, data, error, refetch } = useQuery({
    queryKey: [QUERY_KEY_PLANS, params],
    queryFn: params.id !== undefined ? () => getPlan(params.id!) : () => getPlans(params),
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
        const singleIdquery = params.id !== undefined
        if (singleIdquery || params.type !== planRecType) continue
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

      let existingPlan: Plan | undefined
      for (const query of queries) {
        const data = queryClient.getQueryData(query[0]) as Plan[]
        existingPlan = data?.find(p => p?.id === updated.id)
        if (existingPlan) break
      }

      for (const query of queries) {
        const params = query[0][1] as GetPlanParams
        const singleIdquery = params.id !== undefined
        const regularPlanNotInQuery = (
          !singleIdquery &&
          params.type === 'regular' &&
          updated.dateStart && params.from && params.to &&
          (updated.dateStart < params.from || updated.dateStart > params.to)
        )
        if (singleIdquery || params.type !== planRecType || regularPlanNotInQuery) {
          console.log(singleIdquery)
          queryClient.setQueryData<Plan[]>(
            query[0],
            cache =>
              cache?.filter(p => p.id !== updated.id)
          )
          continue
        }
        queryClient.setQueryData<Plan[]>(
          query[0],
          cache =>
            existingPlan != undefined && !cache?.some(p => p.id === updated.id) && !singleIdquery ?
              cache ? [...cache, { ...existingPlan, ...updated }] : [{ ...existingPlan, ...updated }]
              :
              cache?.map(p => p.id === updated.id ? { ...p, ...updated } : p)
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

export function usePlansBatchDelete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: batchDeletePlans,
    onSuccess: (ids) => {
      const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_PLANS] })
      for (const query of queries) {
        queryClient.setQueryData<Plan[]>(
          query[0],
          cache => cache?.filter(p => !ids.includes(p.id))
        )
      }
    },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    }
  })
}

export function useRegPlanSumsBetweenDatesGet(dateStart: string, dateEnd: string, cats: Category[], enabled = false) {
  const { isPending, isFetching, isError, data, error, refetch } = useQuery({
    queryKey: [QUERY_KEY_REG_PLAN_SUMS_BETWEEN_DATES, dateStart, dateEnd],
    queryFn: ()=> getRegPlanSumsBetweenDates(dateStart, dateEnd, cats),
    enabled,
    staleTime: Infinity,
    retry: 2,
  })
  return { isPending, isFetching, isError, data, error, refetch }
}
