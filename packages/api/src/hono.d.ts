import { SessionContainer } from 'supertokens-node/recipe/session'

declare module 'hono' {
  interface HonoRequest {
    session?: SessionContainer
  }
}
