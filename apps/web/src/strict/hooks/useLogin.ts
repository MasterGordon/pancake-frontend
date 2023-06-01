import { trpc, trpcClient } from '@icecreamswap/backend'

export const useOnLogin = (signer: any, address: string) => async () => {
  if (!signer && !address) return

  // @ts-ignore
  const { nonce } = await trpcClient.session.nonce.query()
  const signature = await signer!.signMessage(nonce)
  // @ts-ignore
  await trpcClient.session.login.mutate({
    signature,
    address: address!,
  })
}
