import { trpc } from '@icecreamswap/backend'

export const useKycDelegationSignature = ({
  chainId,
  sourceAddress,
  targetAddress,
}: {
  chainId: number
  sourceAddress: string
  targetAddress: string
}) => {
  // @ts-ignore
  return trpc.kyc.getDelegationSignature.useQuery({ chainId, sourceAddress, targetAddress })
}
