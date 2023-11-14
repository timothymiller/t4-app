import { SessionContainer } from 'supertokens-node/recipe/session'

declare module 'hono' {
  interface HonoRequest {
    session?: SessionContainer
  }
}

// to make the file a module and avoid the TypeScript error
export {}
