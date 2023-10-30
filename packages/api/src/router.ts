import { router } from './trpc'
import { helloRouter } from './routes/hello'
import { authRouter } from './routes/auth'
import { userRouter } from './routes/user'
import { carsRouter } from './routes/cars'

export const appRouter = router({
  hello: helloRouter,
  user: userRouter,
  auth: authRouter,
  car: carsRouter,
})

export type AppRouter = typeof appRouter
