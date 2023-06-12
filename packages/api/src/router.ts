import { router } from './trpc'
import { helloRouter } from './routes/hello'
import { authRouter } from './routes/auth'
import { userRouter } from './routes/user'

export const appRouter = router({
  hello: helloRouter,
  user: userRouter,
  auth: authRouter,
})

export type AppRouter = typeof appRouter
