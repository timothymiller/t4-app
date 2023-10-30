import { eq } from 'drizzle-orm'
import { UserTable, UserSchema, type User } from '../db/schema'
import { router, protectedProcedure } from '../trpc'
import { parse } from 'valibot'

export const userRouter = router({
  current: protectedProcedure.query(async ({ ctx }) => {
    const { db } = ctx
    const user = await db.select().from(UserTable).where(eq(UserTable.id, ctx.user.id)).get()
    return user
  }),
  create: protectedProcedure
    .input((raw) => parse(UserSchema, raw))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx
      await db.insert(UserTable).values(input).run()
    }),
})
