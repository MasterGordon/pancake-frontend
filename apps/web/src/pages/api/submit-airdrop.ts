import { PrismaClient } from '@icecreamswap/database'
import { utils } from 'ethers'

const client = new PrismaClient()

export default async function handler(req, res) {
  const { address, sig } = req.body
  if (!address && !sig) {
    res.status(400).json({ message: 'missing-args' })
    return
  }
  const recovered = utils.verifyMessage(address, sig)
  if (recovered.toLowerCase() !== address.toLowerCase()) {
    res.status(400).json({ message: 'invalid-sig' })
    return
  }
  const forwarded = req.headers['x-forwarded-for']
  const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
  const before24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const entryWithIp = await client.airdrop.findFirst({
    where: {
      ip,
      createdAt: {
        gte: before24h,
      },
    },
  })
  if (entryWithIp) {
    res.status(400).json({ message: '24h' })
    return
  }
  const entryWithAddress = await client.airdrop.findFirst({
    where: {
      address: {
        equals: address.toLowerCase(),
        mode: 'insensitive',
      },
      createdAt: {
        gte: before24h,
      },
    },
  })
  if (entryWithAddress) {
    res.status(400).json({ message: '24h' })
    return
  }

  await client.airdrop.create({
    data: {
      address: address.toLowerCase(),
      ip,
      campaign: 'fengchao',
    },
  })

  res.json({ message: 'success' })
}
