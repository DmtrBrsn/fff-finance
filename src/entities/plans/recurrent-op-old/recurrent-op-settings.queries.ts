// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// import { addRecurrentOpSettings, deleteRecurrentOpSettings, getRecurrentOpSettings, updateRecurrentOpSettings } from "./recurrent-op-settings.api"
// import { toast } from "@app/toaster"
// import { RecurrentOpSettings } from "./recurrent-op-types"

// export const QUERY_KEY_RECURRENT_OP_SETTINGS = 'RECURRENT_OP_SETTINGS' as const

// export function useRecurrentOpSettingsGet(id: RecurrentOpSettings['id'], enabled = false) {
//   const { isPending, isFetching, isError, data, error, refetch } = useQuery({
//     queryKey: [QUERY_KEY_RECURRENT_OP_SETTINGS, id],
//     queryFn: ()=>getRecurrentOpSettings(id),
//     enabled,
//     staleTime: Infinity
//   })
//   return { isPending, isFetching, isError, data, error, refetch }
// }

// export function useRecurrentOpSettingsAdd() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: addRecurrentOpSettings,
//     onSuccess: (ros) => {
//       const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_RECURRENT_OP_SETTINGS] })
//       for (const query of queries) {
//         let id = query[0][1] as RecurrentOpSettings['id']
//         if (id!==ros.id) {
//           continue
//         }
//         queryClient.setQueryData<RecurrentOpSettings>(
//           query[0],
//           () => ros
//         )
//       }
//     },
//     onError: (err) => {
//       toast.error(err.message)
//       console.error(err)
//     }
//   })
// }

// export function useRecurrentOpSettingsUpdate() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: updateRecurrentOpSettings,
//     onSuccess: (updatedRos) => {
//       const queries = queryClient.getQueriesData({ queryKey: [QUERY_KEY_RECURRENT_OP_SETTINGS] })
//       for (const query of queries) {
//         queryClient.setQueryData<RecurrentOpSettings>(
//           query[0],
//           cache => cache?.id===updatedRos.id ? {...cache, ...updatedRos} : cache
//         )
//       }
//     },
//     onError: (err) => {
//       toast.error(err.message)
//       console.error(err)
//     }
//   })
// }

// export function useRecurrentOpSettingsDelete() { 
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: deleteRecurrentOpSettings,
//     onSuccess: (id) => {
//       queryClient.removeQueries({ queryKey: [QUERY_KEY_RECURRENT_OP_SETTINGS, id] })
//     },
//     onError: (err) => {
//       toast.error(err.message)
//       console.error(err)
//     }
//   })
// }
