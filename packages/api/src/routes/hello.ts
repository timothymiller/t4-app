import { wrap } from '@decs/typeschema'
import { string } from 'valibot'
import { router, publicProcedure } from '../trpc'

export const helloRouter = router({
  world: publicProcedure.input(wrap(string())).query(({ input, ctx }) => {
    return `Hello ${input ?? 'Sam'}!`
  }),
})
