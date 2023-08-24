import { parseAsync, string } from 'valibot'
import { router, protectedProcedure, publicProcedure } from '../trpc'

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.user
  }),
  secretMessage: protectedProcedure
    .input((raw) => parseAsync(string(), raw))
    .query(({ input }) => {
      return `Hello ${input ?? '<Secret>'}!`
    }),
})
