import { useQuery } from '@tanstack/react-query'

import { getHomeCategories } from '../services/get-home-categories'

const useHomeCategories = () => {
    const {data, isLoading, error, refetch} = useQuery({
        queryKey: ['home-categories'],
        queryFn: () => getHomeCategories()
    })
  return {
    data,
    isLoading,
    error,
    refetch
  }
}

export default useHomeCategories