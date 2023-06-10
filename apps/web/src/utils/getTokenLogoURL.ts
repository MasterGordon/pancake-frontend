import { getAddress } from '@ethersproject/address'
import memoize from 'lodash/memoize'
import { Token } from '@pancakeswap/sdk'

const getTokenLogoURL = memoize(
  (token?: Token) => {
    if (token) {
      return `https://icecreamswap-assets.s3.amazonaws.com/token/${token.chainId}/${getAddress(token.address)}.png`
    }
    return null
  },
  (t) => `${t.chainId}#${t.address}`,
)

export default getTokenLogoURL
