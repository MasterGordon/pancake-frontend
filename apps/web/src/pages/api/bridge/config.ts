import { bridgeChains } from '../../../views/Bridge/config'

export default async function handler(req, res) {
  res.json(bridgeChains)
}
