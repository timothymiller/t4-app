import { eq } from 'drizzle-orm'
import { parse } from 'valibot'
import { type User, UserSchema, UserTable } from '../db/schema'
import { protectedProcedure, router } from '../trpc'

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
