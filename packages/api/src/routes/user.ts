import { eq } from 'drizzle-orm'
import { users } from '../db/schema'
import { router, protectedProcedure } from '../trpc'
import { z } from 'zod'

export const userRouter = router({
  current: protectedProcedure.query(async ({ ctx }) => {
    const { db } = ctx
    const user = await db.select().from(users).where(eq(users.id, ctx.user.id)).get()
    if (user) {
      return user
    }
    return null
  }),
  create: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx
      const newUser = {
        email: input.email,
        id: input.id,
      }
      try {
        const user = await db.insert(users).values(newUser).run()
        return user
      } catch (e) {
        console.log('Insert Failed', e)
        return null
      }
    }),
})
