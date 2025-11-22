import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GetBalanceParams } from "../lib/types"
import { addBalance, deleteBalance, getBalance } from "./balance.api"
import { toast } from '../../../features/toaster'


export const QUERY_KEY_BALANCE = 'BALANCE' as const

export function useBalanceGet(params?: GetBalanceParams, enabled = false) {
  const { isPending, isFetching, isError, data, error, refetch } = useQuery({
    queryKey: [QUERY_KEY_BALANCE, params],
    queryFn: () => getBalance(params),
    enabled,
    staleTime: Infinity,
    retry: 2,
  })
  return { isPending, isFetching, isError, data, error, refetch }
}

export function useBalanceAdd() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addBalance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_BALANCE] })
    },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    }
  })
}

export function useBalanceDelete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteBalance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_BALANCE] })
    },
    onError: (err) => {
      toast.error(err.message)
      console.error(err)
    }
  })
}
