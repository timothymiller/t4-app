import { initTRPC, TRPCError } from '@trpc/server'
import { type Context } from './context'
import superJson from 'superjson'
import { ObjectSchema, ObjectShape, parse } from 'valibot'

const t = initTRPC.context<Context>().create({
  transformer: superJson,
  errorFormatter({ shape }) {
    return shape
  },
})

export const valibotParser =
  <T extends ObjectShape>(schema: ObjectSchema<T>) =>
  (raw: any) =>
    parse(schema, raw)

/**
 * This is a middleware that checks if the user is authenticated
 * @link https://trpc.io/docs/middlewares
 */
const isAuthed = t.middleware(({ next, ctx }) => {
  if (ctx.user === null) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' })
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)
