import { initTRPC, TRPCError } from '@trpc/server'
import { type Context } from './context'
import superJson from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: superJson,
  errorFormatter({ shape }) {
    return shape
  },
})

/**
 * This is a middleware that checks if the user is authenticated
 * @link https://trpc.io/docs/middlewares
 */
const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' })
  }
  return next({
    ctx: {
      session: ctx.session,
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)
