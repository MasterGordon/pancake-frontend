import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Listed, Token } from '@icecreamswap/database'
import { prisma } from '../src/server/prisma'
import dotenv from 'dotenv'
import fs from 'fs'
import axios from 'axios'

dotenv.config({
  path: `${__dirname}/../../../apps/web/.env.local`,
})
;(async () => {
  const allTokens = await prisma.token.findMany({})

  const s3Client = new S3Client({})
  const faulty: string[] = []
  await Promise.all(
    allTokens.map(async (token) => {
      const logoUri = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/token/${token.chainId}/${token.address}.png`
      try {
        const logo = await axios.get(logoUri, { responseType: 'arraybuffer' })
        const binary = Buffer.from(logo.data, 'base64')
        console.log(binary.length)
        if (binary.length < 3000) {
          faulty.push(token.address)
        }
      } catch (e) {
        faulty.push(token.address)
      }
    }),
  )
  await Promise.all(
    allTokens.map(async (token) => {
      if (faulty.includes(token.address)) {
        console.log(`Deleting ${token.address}`)
      }
    }),
  )
})()
