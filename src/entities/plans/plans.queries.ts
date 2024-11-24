import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@app/toaster"
import { addPlan, deletePlan, getAllPlans, updatePlan } from "./plans.api"
import { Plan } from "./plans.types"

export const QUERY_KEY_PLANS = 'PLANS' as const

export function usePlansGet(enabled: boolean = true) {
  const { isPending, isFetching, isError, data, error } = useQuery({
    queryKey: [QUERY_KEY_PLANS],
    queryFn: getAllPlans,
    enabled,
    staleTime: Infinity
  })
  return { isPending, isFetching, isError, data, error }
}

export function usePlansAdd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addPlan,
    onSuccess: (added) => {
      queryClient.setQueryData<Plan[]>(
				[QUERY_KEY_PLANS],
				cache => cache ? [...cache, added] : [added]
			)
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
      queryClient.setQueryData<Plan[]>(
				[QUERY_KEY_PLANS],
				cache =>
					cache?.map(p => p.id === updated.id ? {...p, ...updated} : p)
			)
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
      queryClient.setQueryData<Plan[]>(
				[QUERY_KEY_PLANS],
				cache => cache?.filter(p => p.id !== id)
			)
    },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    }
  })
}
