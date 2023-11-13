import { router, protectedProcedure, publicProcedure } from '../trpc'

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session
  }),
  secretMessage: protectedProcedure.query(() => {
    return 'You are authenticated!'
  }),
})
