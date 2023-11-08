import { parse, string } from 'valibot'
import { publicProcedure, router } from '../trpc'

export const helloRouter = router({
  world: publicProcedure
    .input((raw) => parse(string(), raw))
    .query(({ input }) => {
      return `Hello ${input}!`
    }),
})
