import { type inferAsyncReturnType } from '@trpc/server'
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { DrizzleD1Database } from 'drizzle-orm/d1'
import { createDb } from './db/client'
import jwt from '@tsndr/cloudflare-worker-jwt'

interface User {
  id: string
}

interface ApiContextProps {
  user: User | null
  db: DrizzleD1Database
}

export const createContext = async (
  d1: D1Database,
  JWT_VERIFICATION_KEY: string,
  opts: FetchCreateContextFnOptions
): Promise<ApiContextProps> => {
  const db = createDb(d1)

  async function getUser() {
    const sessionToken = opts.req.headers.get('authorization')
    if (sessionToken) {
      if (!JWT_VERIFICATION_KEY) {
        console.error('JWT_VERIFICATION_KEY is not set')
        return null
      }

      // Check if token is valid
      const splitPem = JWT_VERIFICATION_KEY.match(/.{1,64}/g) as string[]
      const publicKey =
        '-----BEGIN PUBLIC KEY-----\n' + splitPem.join('\n') + '\n-----END PUBLIC KEY-----'
      try {
        const authorized = await jwt.verify(sessionToken, publicKey, {
          algorithm: 'RS256',
        })
        if (!authorized) {
          return null
        }

        const decodedToken = jwt.decode(sessionToken)

        // Check if token is expired
        const expirationTimestamp = decodedToken.payload.exp
        const currentTimestamp = Math.floor(Date.now() / 1000)
        if (!expirationTimestamp || expirationTimestamp < currentTimestamp) {
          return null
        }

        const userId = decodedToken?.payload?.sub

        if (userId) {
          return {
            id: userId,
          }
        }
      } catch (e) {
        console.error(e)
      }
    }

    return null
  }

  const user = await getUser()

  return { user, db }
}

export type Context = inferAsyncReturnType<typeof createContext>
