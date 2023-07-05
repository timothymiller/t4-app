import { router, protectedProcedure, publicProcedure } from '../trpc'
import { z } from 'zod'

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.user
  }),
  secretMessage: protectedProcedure.input(z.string().nullish()).query(({ input }) => {
    return `Hello ${input ?? '<Secret>'}!`
  }),
})
