import { desc, eq } from 'drizzle-orm'
import { UserTable, type User, SessionTable, AuthMethodTable } from '../db/schema'
import { router, protectedProcedure, publicProcedure, valibotParser } from '../trpc'
import { Input } from 'valibot'
import { ApiContextProps } from '../context'
import {
  SignInResult,
  createSession,
  createUser,
  sendEmailSignIn,
  sendPhoneSignIn,
  signInWithEmail,
  signInWithCode,
  signOut,
  signOutEverywhere,
  updateAuthEmail,
  updatePassword,
  getUserByEmail,
  signInWithOAuthCode,
} from '../auth/user'
import { TRPCError } from '@trpc/server'
import { GetByIdSchema, GetSessionsSchema } from '../schema/shared'
import { CreateUserSchema, SignInSchema } from '../schema/user'
import { AppleIdTokenClaims, generateCodeVerifier, generateState } from 'arctic'
import { getAuthProvider, getUserFromAuthProvider } from '../auth/shared'
import { getPayloadFromJWT, isJWTExpired, sha256 } from '../utils/crypto'
import { getCookie } from 'hono/cookie'
import { JWT, parseJWT } from '../utils/jwt'

export function sanitizeUserIdInput<K extends keyof T, T>({
  ctx,
  input,
  idField,
}: {
  ctx: ApiContextProps
  input?: T
  idField: K
}): string {
  if (!input && !ctx.user?.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No user ID was provided.',
    })
  }
  if (input?.[idField] && ctx.user?.id !== input[idField]) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You are not authorized to view info owned by other user accounts.',
    })
  }
  if (input) {
    if (!input[idField]) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'A user ID is required.',
      })
    }
    return input[idField] as string
  }
  if (!ctx.user?.id) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'A user ID is required.',
    })
  }
  return ctx.user.id
}

async function getSessions({
  ctx,
  input,
}: {
  ctx: ApiContextProps
  input?: Input<typeof GetSessionsSchema>
}) {
  const userId = sanitizeUserIdInput({ ctx, input, idField: 'userId' })
  return (
    ctx.db
      .select()
      .from(SessionTable)
      .where(eq(SessionTable.userId, userId))
      .orderBy(desc(SessionTable.expiresAt))
      // TODO pagination...
      .limit(50)
  )
}

async function getUser({
  ctx,
  input,
}: {
  ctx: ApiContextProps
  input?: Input<typeof GetByIdSchema>
}) {
  const userId = sanitizeUserIdInput({ ctx, input, idField: 'id' })
  const authMethods = ctx.db
    .select()
    .from(AuthMethodTable)
    .where(eq(AuthMethodTable.userId, userId))
  const res = await ctx.db.select().from(UserTable).where(eq(UserTable.id, userId))
  return {
    user: res?.[0],
    authMethods: await authMethods,
  }
}

async function getUserByEmail(ctx: ApiContextProps, email: string) {
  try {
    const existingUserKey = await ctx.auth.getKey('email', email)
    if (existingUserKey) {
      const users = await ctx.db
        .select()
        .from(UserTable)
        .where(eq(UserTable.id, existingUserKey.userId))
      if (users?.length) {
        return users[0]
      }
    }
  } catch (e) {
    if (e instanceof LuciaError && e.message === 'AUTH_INVALID_KEY_ID') {
      // no user exists with this email
    } else {
      throw e
    }
  }
  return false
}

interface AppleIdTokenPayload {
  nonce?: string
  nonce_supported?: string
  sub: string
  email?: string
  email_verified?: boolean
}

const validateRedirectDomain = (ctx: ApiContextProps, redirectTo?: string) => {
  if (!redirectTo) {
    return true
  }
  return (
    (ctx.env.PUBLIC_API_URL && redirectTo.startsWith(ctx.env.PUBLIC_API_URL)) ||
    (ctx.env.APP_URL && redirectTo.startsWith(ctx.env.APP_URL)) ||
    (ctx.env.PUBLIC_NATIVE_SCHEME && redirectTo.startsWith(ctx.env.PUBLIC_NATIVE_SCHEME))
  )
}

const signIn = async ({
  ctx,
  input,
}: {
  ctx: ApiContextProps
  input: Input<typeof SignInSchema>
}) => {
  let res: SignInResult = {}
  if (input.provider && input.idToken) {
    // This supports native sign-in with apple
    //
    // It could be possible to fetch the Apple public RSA key and verify the JWT.
    // However, cloudflare workers webcrypto threw in error during testing:
    // `Unrecognized key import algorithm "RS256" requested`
    // https://developers.cloudflare.com/workers/runtime-apis/web-crypto/#supported-algorithms
    // const payload = (await getPayloadFromJWT(input.idToken, async (payload: JWT) => {
    //   if (
    //     !('kid' in payload.header) ||
    //     typeof payload.header.kid !== 'string' ||
    //     !payload.header.kid
    //   ) {
    //     throw new Error('Missing key id in Apple idToken')
    //   }
    //   const kid = payload.header.kid
    //   let key = ''
    //   try {
    //     const res = await (await fetch('https://appleid.apple.com/auth/keys')).json()
    //     key = (res as any).keys.find((key: any) => key.kid === kid)
    //   } catch (e) {}
    //   if (!key) {
    //     throw new Error('Unable to fetch Apple public key')
    //   }
    //   return key
    // })) as AppleIdTokenClaims & { nonce?: string; nonce_supported?: boolean }
    // Since we can't verify the JWT, check that it hasn't expired
    const parsedJWT = parseJWT(input.idToken)
    if (parsedJWT && isJWTExpired(parsedJWT)) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'The Apple ID token has expired.',
      })
    }
    const payload = parsedJWT?.payload as AppleIdTokenClaims & {
      nonce?: string
      nonce_supported?: boolean
    }
    if (!payload) {
      console.error('Apple ID token could not be verified.', {
        payload,
        ...input,
      })
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'The Apple ID token could not be verified.',
      })
    }
    // Verify the nonce generated by Sign in with Apple
    // It uses sha256 to match how supabase handles this
    if (
      payload.nonce_supported &&
      (!input.nonce || (await sha256(input.nonce)) !== payload.nonce)
    ) {
      // verify the nonce matches the one embedded in the token
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: `The Apple ID token verification does not match. payload ${payload.nonce} !== input ${input.nonce}`,
      })
    }
    // Construct our own lucia provider validate result from the JWT contents and create a session
    const user = await getUserFromAuthProvider(ctx, 'apple', getAuthProvider(ctx, 'apple'), {
      ...input,
      idTokenClaims: payload,
    })
    const session = await createSession(ctx.auth, user.id)
    ctx.authRequest?.setSessionCookie(session.id)
    res.session = session
  } else if (input.provider && input.code) {
    // Handling OAuth callback after user has authenticated with provider
    if (!ctx.c) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'The request context is not available.',
      })
    }

    const storedState = getCookie(ctx.c, `${input.provider}_oauth_state`)
    const storedRedirect = getCookie(ctx.c, `${input.provider}_oauth_redirect`)
    res = await signInWithOAuthCode(
      ctx,
      input.provider,
      input.code,
      input.state,
      storedState,
      storedRedirect
    )
  } else if (input.provider) {
    // Get the authorization URL and store the state in a cookie
    const provider = getAuthProvider(ctx, input.provider)
    const state = generateState()
    // TODO Mentioned in docs but seem to be used yet... circle back with future arctic release
    // const codeVerifier = generateCodeVerifier()
    const url = await provider.createAuthorizationURL(state)
    ctx.setCookie(`${input.provider}_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax`)
    if (!validateRedirectDomain(ctx, input.redirectTo)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `The redirect URL is invalid: ${input.redirectTo}`,
      })
    }
    ctx.setCookie(
      `${input.provider}_oauth_redirect=${input.redirectTo || ''}; Path=/; HttpOnly; SameSite=Lax`
    )
    res.redirectTo = url.toString()
  }
  if (input.email) {
    if (input.code) {
      res = await signInWithCode(ctx, 'email', input.email, input.code, ctx.setCookie)
      if (res.session?.userId && input.password) {
        // If the user is also resetting their password,
        // update the password, invalidate all sessions, create a new session and return it
        updatePassword(ctx, input.email, input.password)
        console.log('calling update passing and invalidate sessions')
        await ctx.auth.invalidateUserSessions(res.session?.userId)
        const session = await createSession(ctx.auth, res.session?.userId)
        ctx.authRequest?.setSessionCookie(session.id)
        res.session = session
      }
    } else if (input.password) {
      res = await signInWithEmail(ctx, input.email, input.password, ctx.setCookie)
    } else {
      res = await sendEmailSignIn(ctx, input.email)
    }
    // } else if (input.phone) {
    //   if (input.code) {
    //     res = await signInWithPhoneAndCode(ctx, input.phone, input.code, ctx.setCookie)
    //   } else {
    //     res = await sendPhoneSignIn(ctx, input.phone)
    //   }
  }
  // console.log('log in result', res)
  return res
}

export const userRouter = router({
  signIn: publicProcedure.input(valibotParser(SignInSchema)).mutation(signIn),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be signed in to sign out.',
      })
    }
    return await signOut(ctx.auth, ctx.session.id, ctx.setCookie)
  }),

  signOutEverywhere: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user?.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be signed in to sign out of all sessions.',
      })
    }
    return await signOutEverywhere(ctx.auth, ctx.user.id, ctx.setCookie)
  }),

  session: publicProcedure.query(({ ctx }) => {
    return { session: ctx.session, user: ctx.user }
  }),
  sessions: protectedProcedure.query(getSessions),
  current: protectedProcedure.query(getUser),

  create: publicProcedure
    .input(valibotParser(CreateUserSchema))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx

      // check that the email isn't already used for auth
      const existingUser = await getUserByEmail(ctx, input.email)
      if (existingUser) {
        // throw new TRPCError({
        //   code: 'CONFLICT',
        //   message: `A user already exists with this email: ${input.email}`,
        // })
        // Maybe we should just try to sign in with those credentials...
        return await signIn({
          ctx,
          input: {
            email: input.email,
            password: input.password,
          },
        })
      }

      const user = await createUser(ctx, 'email', input.email, input.password, {
        email: input.email,
      })
      const session = await createSession(ctx.auth, user.id)
      ctx.authRequest?.setSessionCookie(session.id)
      return { session }
    }),
})
