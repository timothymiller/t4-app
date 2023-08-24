import { wrap } from '@decs/typeschema'
import { string } from 'valibot'
import { router, protectedProcedure, publicProcedure } from '../trpc'

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.user
  }),
  secretMessage: protectedProcedure.input(wrap(string())).query(({ input }) => {
    return `Hello ${input ?? '<Secret>'}!`
  }),
})
