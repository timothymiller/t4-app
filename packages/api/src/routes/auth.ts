import { protectedProcedure, publicProcedure, router } from '../trpc'

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.user
  }),
  secretMessage: protectedProcedure.query(() => {
    return 'You are authenticated!'
  }),
})
