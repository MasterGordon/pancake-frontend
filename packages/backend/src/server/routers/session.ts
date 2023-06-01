import { z } from 'zod'
import { createHash } from 'crypto'
import { verifyMessage } from 'viem'
import { router, publicProcedure } from '../trpc'
import { address } from '../../zod-utils'
import { User } from '../session'
import { prisma } from '../prisma'

const secret = process.env.SECRET_COOKIE_PASSWORD!

const getCurrentNonce = (key: string) => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const currentDay = currentDate.getDate()
  const currentHour = currentDate.getHours()
  const secretHash = createHash('sha256')
  secretHash.update(`${key}${currentYear}${currentMonth}${currentDay}${currentHour}${secret}`)
  return secretHash.digest('hex')
}

type UserQuery = Partial<Pick<User, 'wallet' | 'name' | 'role'>> & { isLoggedIn: boolean }

export const sessionRouter = router({
  user: publicProcedure.query<UserQuery>(async ({ ctx }) => {
    if (ctx.session.user) {
      return { ...ctx.session.user, isLoggedIn: true }
    }
    return { isLoggedIn: false }
  }),
  nonce: publicProcedure.query(async () => {
    const nonce = getCurrentNonce('session')
    return { nonce }
  }),

  login: publicProcedure
    .input(
      z.object({
        address,
        signature: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<User | undefined> => {
      if (
        !(await verifyMessage({
          address: input.address as `0x${string}`,
          message: getCurrentNonce('session'),
          signature: input.signature as `0x${string}`,
        }))
      ) {
        ctx.res.status(401)
        return
      }
      const { session } = ctx
      const userData = await prisma.user.findFirst({
        where: { wallet: input.address },
        select: {
          name: true,
          role: true,
          wallet: true,
        },
      })
      if (userData) {
        session.user = userData
      } else {
        console.log('where', input.address.toLowerCase())
        const kyc = await prisma.kyc.findFirst({
          where: { address: input.address.toLowerCase(), status: 'verified' },
        })
        console.log(kyc)
        session.user = { wallet: input.address.toLowerCase(), name: 'Anonymous', role: kyc ? 'KYC' : 'USER' }
      }
      await session.save()
    }),
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const { session } = ctx
    session.user = undefined
    await ctx.session.save()
  }),
})
