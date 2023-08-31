import { parse, string } from 'valibot'
import { router, publicProcedure } from '../trpc'

export const helloRouter = router({
  world: publicProcedure
    .input((raw) => parse(string(), raw))
    .query(({ input }) => {
      return `Hello ${input}!`
    }),
})
