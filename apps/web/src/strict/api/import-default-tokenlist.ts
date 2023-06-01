/* eslint-disable no-await-in-loop */
import { trpcClient } from '@icecreamswap/backend'
import tokenList from '../../../public/default.tokenlist.json'

export default async function handler(req, res) {
  if (process.env.NODE_ENV !== 'development') return
  for (const token of tokenList.tokens) {
    let logo
    let logoUri
    try {
      logo = await fetch(token.logoURI)
      const buffer = await logo.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      token.logoURI = `data:image/png;base64,${base64}`
    } catch (e) {
      console.error(`Error fetching logo ${token.logoURI}`)
    }
    // @ts-ignore
    await trpcClient.token.add.mutate({
      logo: logoUri,
      chainId: token.chainId,
      tokenName: token.name,
      tokenSymbol: token.symbol,
      tokenAddress: token.address,
      tokenDecimals: token.decimals,
    })
  }
  res.json('ok')
}
