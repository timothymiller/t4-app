import { match } from 'ts-pattern'
import { createContext } from './context'
import { Bindings } from './worker'

const scheduled: ExportedHandlerScheduledHandler<Bindings> = async (event, env, _) => {
  console.log('Running cron', event.cron)
  const ctx = await createContext(env)
  await match({ event, ctx })
    .with({ event: { cron: '15 2 * * sat' } }, async ({ ctx }) => {
      await ctx.auth.deleteExpiredSessions()
      console.log('Deleted expired sessions')
    })
    .otherwise(async () => {
      console.log('Unhandled cron event', event)
    })
}

export default scheduled
