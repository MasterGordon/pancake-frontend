import { trpc } from '@icecreamswap/backend'

export const useSubmitDelegation = (chainId: number, sourceAddress: string, targetAddress: string) => {
  // @ts-ignore
  return trpc.kyc.submitDelegation.useMutation({ chainId, sourceAddress, targetAddress })
}
