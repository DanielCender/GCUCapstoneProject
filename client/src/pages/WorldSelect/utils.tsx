import useSWR from 'swr'
import { Contracts } from '../../../../types/Contracts'
import { useUserContext } from '../../state/UserContext'

export const useUserWorlds = () => {
  const { authHeaders } = useUserContext()

  const fetcher = (url: string) =>
    fetch(url, {
      headers: {
        ...authHeaders,
      },
    }).then((res) => res.json())

  const { data, error, isLoading, mutate } = useSWR<Contracts.GetWorlds.GetWorldsResponse>(
    `${import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL}/worlds`,
    fetcher
  )

  return {
    data,
    error,
    isLoading,
    mutate,
  }
}
