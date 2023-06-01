import { trpc } from '@icecreamswap/backend'

export const useUser = () => {
  // @ts-ignore
  const user = trpc.session.user.useQuery(undefined, {
    refetchInterval: false,
  })
  return user
}
