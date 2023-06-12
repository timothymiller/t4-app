import { router, publicProcedure } from '../trpc'
import { z } from 'zod'

export const helloRouter = router({
  world: publicProcedure.input(z.string().nullish()).query(({ input, ctx }) => {
    return `Hello ${input ?? 'Sam'}!`
  }),
})
