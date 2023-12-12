import { desc, eq } from 'drizzle-orm'
import { UserTable, SessionTable, AuthMethodTable } from '../db/schema'
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
import {
  AppleIdTokenClaims,
  getAuthProvider,
  getAuthorizationUrl,
  getUserFromAuthProvider,
} from '../auth/shared'
import { isJWTExpired, sha256 } from '../utils/crypto'
import { getCookie } from 'hono/cookie'
import { parseJWT } from 'oslo/jwt'
import { P, match } from 'ts-pattern'
import { AuthProviderName } from '../auth/providers'

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

const signInWithAppleIdTokenHandler =
  (ctx: ApiContextProps) =>
  async (input: Input<typeof SignInSchema> & { provider: AuthProviderName; idToken: string }) => {
    // This supports native sign-in with apple
    //
    // It could be possible to fetch the Apple public RSA key and verify the JWT.
    // However, cloudflare workers webcrypto threw in error during testing:
    // `Unrecognized key import algorithm "RS256" requested`
    // https://developers.cloudflare.com/workers/runtime-apis/web-crypto/#supported-algorithms
    // const payload = (await verifyToken(input.idToken, async (payload: JWT) => {
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
    // })) as unknown as AppleIdTokenClaims
    // Since we can't verify the JWT, check that it hasn't expired
    const parsedJWT = parseJWT(input.idToken)
    if (parsedJWT && isJWTExpired(parsedJWT)) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'The Apple ID token has expired.',
      })
    }
    const payload = parsedJWT?.payload as AppleIdTokenClaims
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
    if (ctx.setCookie) {
      ctx.setCookie(ctx.auth.createSessionCookie(session.id).serialize())
    }
    return { session }
  }

const signInWithOAuthCodeHandler =
  (ctx: ApiContextProps) =>
  async (input: Input<typeof SignInSchema> & { provider: AuthProviderName; code: string }) => {
    // Handling OAuth callback after user has authenticated with provider
    if (!ctx.c) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'The request context is not available.',
      })
    }

    const storedState = getCookie(ctx.c, `${input.provider}_oauth_state`)
    const storedVerifier = getCookie(ctx.c, `${input.provider}_oauth_verifier`)
    const storedRedirect = getCookie(ctx.c, `${input.provider}_oauth_redirect`)
    return await signInWithOAuthCode(
      ctx,
      input.provider,
      input.code,
      input.state,
      storedState,
      storedRedirect,
      input.appleUser
    )
  }

const authorizationUrlHandler =
  (ctx: ApiContextProps) =>
  async (input: Input<typeof SignInSchema> & { provider: AuthProviderName }) => {
    const url = await getAuthorizationUrl(ctx, input.provider)
    if (!validateRedirectDomain(ctx, input.redirectTo)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `The redirect URL is invalid: ${input.redirectTo}`,
      })
    }
    const secure = ctx.req?.url.startsWith('https:') ? 'Secure; ' : ''
    ctx.setCookie(
      `${input.provider}_oauth_redirect=${
        input.redirectTo || ''
      }; Path=/; ${secure}HttpOnly; SameSite=Lax`
    )
    return { redirectTo: url.toString() }
  }

const signInWithEmailCodeHandler =
  (ctx: ApiContextProps) =>
  async (input: Input<typeof SignInSchema> & { email: string; code: string }) => {
    const res = await signInWithCode(ctx, 'email', input.email, input.code, ctx.setCookie)
    if (res.session?.userId && input.password) {
      // If the user is also resetting their password,
      // update the password, invalidate all sessions, create a new session and return it
      updatePassword(ctx, input.email, input.password)
      console.log('calling update passing and invalidate sessions')
      await ctx.auth.invalidateUserSessions(res.session?.userId)
      const session = await createSession(ctx.auth, res.session?.userId)
      if (ctx.setCookie) {
        ctx.setCookie(ctx.auth.createSessionCookie(session.id).serialize())
      }
      res.session = session
    }
    return res
  }

const signIn = async ({
  ctx,
  input,
}: {
  ctx: ApiContextProps
  input: Input<typeof SignInSchema>
}) => {
  return await match(input)
    .returnType<Promise<SignInResult>>()
    .with({ provider: P.string, idToken: P.string }, signInWithAppleIdTokenHandler(ctx))
    .with({ provider: P.string, code: P.string }, signInWithOAuthCodeHandler(ctx))
    .with({ provider: P.string }, authorizationUrlHandler(ctx))
    .with({ email: P.string, code: P.string }, signInWithEmailCodeHandler(ctx))
    .with({ email: P.string, password: P.string }, async (input) => {
      return await signInWithEmail(ctx, input.email, input.password, ctx.setCookie)
    })
    .with({ email: P.string }, async (input) => {
      return await sendEmailSignIn(ctx, input.email)
    })
    // .with({ phone: P.string, code: P.string }, async (input) => {
    //   return await signInWithPhoneAndCode(ctx, input.phone, input.code, ctx.setCookie)
    // .with({ phone: P.string }, async (input) => {
    //     return await sendPhoneSignIn(ctx, input.phone)
    // })
    .otherwise(() => {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid sign in request.',
      })
    })
}

export const userRouter = router({
  signIn: publicProcedure.input(valibotParser(SignInSchema)).mutation(signIn),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session?.id) {
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
      if (ctx.setCookie) {
        ctx.setCookie(ctx.auth.createSessionCookie(session.id).serialize())
      }
      return { session }
    }),
})
