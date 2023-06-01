import { initTRPC } from '@trpc/server'
import { Context } from './context'

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return shape
  },
})

export const { router, middleware, mergeRouters } = t

export const publicProcedure = t.procedure
