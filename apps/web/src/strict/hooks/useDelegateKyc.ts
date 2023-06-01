import { trpc } from '@icecreamswap/backend'

export const useDelegateKyc = () => {
  // @ts-ignore
  return trpc.kyc.delegate.useMutation()
}
