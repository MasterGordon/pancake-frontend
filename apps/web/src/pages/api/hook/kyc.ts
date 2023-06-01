import { JsonRpcProvider } from '@ethersproject/providers'
import { chainMap } from '@icecreamswap/constants'
import { PrismaClient } from '@icecreamswap/database'
import { Contract, utils, Wallet } from 'ethers'
import kycAbi from '../../../config/abi/kyc.json'

const client = new PrismaClient()

export default async function handler(req, res) {
  // eslint-disable-next-line camelcase
  const { session_id, state } = req.body
  const { secret } = req.query
  if (secret !== process.env.SYNAPS_SECRET) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  if (state !== 'VALIDATED') {
    res.json({ message: 'ok' })
    return
  }

  const response = await fetch('https://individual-api.synaps.io/v3/session/info', {
    method: 'GET',
    headers: {
      'Client-Id': process.env.SYNAPS_CLIENT_ID,
      'Session-Id': session_id,
      'Api-Key': process.env.SYNAPS_API_KEY,
    },
  })
  if (!response.ok) {
    res.status(500).json({ message: 'Synaps error' })
    return
  }

  const { alias, status } = await response.json()
  if (status !== 'VERIFIED') {
    res.json({ message: 'ok' })
    return
  }

  const address = alias.toLowerCase()

  await client.kyc.update({
    where: {
      address,
    },
    data: {
      status: 'verified',
    },
  })

  const provider = new JsonRpcProvider(chainMap.core.rpcUrls.default)

  const signer = new Wallet(process.env.KYC_MINTER, provider)

  const kyc = new Contract(chainMap.core.kyc.tokenAddress, kycAbi, signer)
  await kyc.safeMint(address)

  res.json({ message: 'ok' })
}
