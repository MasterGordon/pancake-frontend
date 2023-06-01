import { trpcClient } from '@icecreamswap/backend'
import { TokenList } from '@uniswap/token-lists'

export const getDefaultTokenList = async (): Promise<TokenList> => {
  // @ts-ignore
  return trpcClient.token.defaultList.query()
}
