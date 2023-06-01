import { PrismaClient } from '@icecreamswap/database'

const client = new PrismaClient()

export default async function handler(req, res) {
  const { address } = req.query

  const count = await client.kyc.count({
    where: {
      address: address.toLowerCase(),
    },
  })
  return res.json(count > 0)
}
