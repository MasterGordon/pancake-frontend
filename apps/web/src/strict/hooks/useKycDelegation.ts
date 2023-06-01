import { trpc } from '@icecreamswap/backend'

export const useKycDelegation = ({
  chainId,
  sourceAddress,
  targetAddress,
}: {
  chainId: number
  sourceAddress: string
  targetAddress: string
}) => {
  // @ts-ignore
  return trpc.kyc.getDelegation.useQuery({ chainId, sourceAddress, targetAddress })
}
