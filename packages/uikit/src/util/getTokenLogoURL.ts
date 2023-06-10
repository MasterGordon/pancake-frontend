import { getAddress } from "@ethersproject/address";
import memoize from "lodash/memoize";

const getTokenLogoURL = memoize(
  (chainId: number, tokenAddress?: string) => {
    if (tokenAddress) {
      return `https://icecreamswap-assets.s3.amazonaws.com/token/${chainId}/${getAddress(tokenAddress)}.png`;
    }
    return undefined;
  },
  (chainId, tokenAddress) => `${chainId}#${tokenAddress}`
);

export default getTokenLogoURL;
