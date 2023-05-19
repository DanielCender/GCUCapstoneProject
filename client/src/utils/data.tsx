// import React from 'react'
// import useSWR from 'swr';
// import { useUserContext } from '../state/UserContext';

// const urlPrefix = import.meta.env.VITE_LITTLE_OFFICES_SERVER_URL

// export const fetcher = (input: RequestInfo | URL, init?: RequestInit | undefined) =>
//   fetch(input, init).then((res) => res.json())

// export const useWorlds = (userId: string) => {
//     const {authHeaders} = useUserContext()
//     const { data, error, isLoading } = useSWR(`${urlPrefix}/worlds`, fetcher)

//     return {
//       user: data,
//       isLoading,
//       isError: error
//     }
//   }
