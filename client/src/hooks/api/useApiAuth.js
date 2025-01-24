import { useQuery } from '@tanstack/react-query'
import authApi from '../../apis/auth.api'

export const useApiProfile = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authApi.me()
  })
}
