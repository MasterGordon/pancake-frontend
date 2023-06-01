import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { getIronSession, IronSession } from 'iron-session'
import { Session, sessionOptions } from './session'

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const session = (await getIronSession(opts.req, opts.res, sessionOptions)) as IronSession & Session

  return { session, res: opts.res }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
