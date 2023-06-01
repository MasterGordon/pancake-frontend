import { PrismaClient } from '@icecreamswap/database'

const client = new PrismaClient()

export default async function handler(req, res) {
  const { chainId } = req.body
  const tokens = await client.token.findMany({
    where: {
      chainId,
    },
  })
  res.json(tokens)
}
