import { desc, eq } from 'drizzle-orm'
import { UserTable, UserSchema, type User, UserKeyTable, SessionTable } from '../db/schema'
import { router, protectedProcedure, publicProcedure, valibotParser } from '../trpc'
import { Input, parse } from 'valibot'
import { ApiContextProps } from '../context'
import { SessionUser, SignInResult, createSession, createUser, getPayloadFromJWT, getUserId, sendEmailSignIn, sendPhoneSignIn, signInWithEmail, signInWithCode, signOut, signOutEverywhere, updateAuthEmail, updatePassword } from '../auth/user'
import { TRPCError } from '@trpc/server'
import { LuciaError } from 'lucia'
import { GetByIdSchema, GetSessionsSchema } from '../schema/shared'
import { CreateUserSchema, SignInSchema } from '../schema/user'
import { getAuthProvider } from '../auth/shared'
import { decodeIdToken, providerUserAuth } from '@lucia-auth/oauth'
import { getUserFromProviderUserAuth } from '../auth/hono'
import { AppleUser, AppleUserAuth } from '@lucia-auth/oauth/providers'
import { JwtData } from '@tsndr/cloudflare-worker-jwt'

// It's annoying that this class isn't exported...
// import { AppleUserAuth } from '@lucia-auth/oauth/providers'

export function sanitizeUserIdInput<K extends keyof T, T>({
  ctx,
  input,
  idField,
}: {
  ctx: ApiContextProps
  input?: T
  idField: K
}): string {
  if (!input && !ctx.session?.user?.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No user ID was provided.',
    })
  }
  if (
    input?.[idField] &&
    ctx.session?.user?.userId !== input[idField]
  ) {
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
  if (!ctx.session?.user?.userId) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'A user ID is required.',
    })
  }
  return ctx.session.user.userId
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
      .orderBy(desc(SessionTable.activeExpires))
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
  const userKeys = ctx.db
    .select()
    .from(UserKeyTable)
    .where(eq(UserKeyTable.userId, userId))
  const res = await ctx.db.select().from(UserTable).where(eq(UserTable.id, userId))
  return {
    user: res?.[0],
    userKeys: await userKeys,
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

// We're going to only allow a single primary auth email per user
// This will update the email or set the password
// Use null for the password to unset a password
async function setEmailAuth(
  ctx: ApiContextProps,
  user: User | SessionUser,
  email: string,
  password?: string | null
) {
  const userId = getUserId(user)
  if (email !== user?.email) {
    // check that the email isn't already used for auth
    const existingUser = await getUserByEmail(ctx, email)
    if (existingUser && existingUser.id !== userId) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: `A user already exists with this email: ${email}`,
      })
    }
    await updateAuthEmail(ctx, user, email)
  }
  if (password !== undefined) {
    await updatePassword(ctx.auth, email, password)
  }
}

interface AppleIdTokenPayload {
  nonce?: string;
  nonce_supported?: string;
  sub: string;
  email?: string;
  email_verified?: boolean;
}

const signIn = async ({ ctx, input }: { ctx: ApiContextProps, input: Input<typeof SignInSchema>}) => {
  let res: SignInResult = {}
  try {
    if (input.provider && input.token) {
      // This supports native sign-in with apple
      // The handler for other oauth providers can be found in handleOAuthCallback in packages/api/src/auth/hono.ts
      // which is called by the oauth callback route handler defined in packages/api/src/index.js

      // If you are concerned about man-in-the-middle attacks, you can try fetching
      // the Apple public RSA key and verify the JWT.
      // const payload = await getPayloadFromJWT(input.token, async (payload: JwtData) => {
      //   if (!payload.header.kid) {
      //     throw new Error('Missing key id in Apple idToken')
      //   }
      //   let key = ''
      //   try {
      //     const res = await (await fetch('https://appleid.apple.com/auth/keys')).json()
      //     key = (res as any).keys.find((key: any) => key.kid === payload.header.kid)
      //   } catch (e) { }
      //   if (!key) {
      //     throw new Error('Unable to fetch Apple public key')
      //   }
      //   return key
      // })
      const payload = decodeIdToken<AppleIdTokenPayload>(input.token)
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
      // verify the nonce matches the one embedded in the token
      if (payload.nonce_supported && (!input.nonce || payload.nonce !== input.nonce)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'The Apple ID token verification does not match.',
        })
      }
      // Construct our own lucia provider validate result from the JWT contents and create a session
      const appleUser: AppleUser = {
        sub: payload.sub,
        email: payload.email,
        email_verified: payload.email_verified
      };
      const validateResult = providerUserAuth(ctx.auth, 'apple', payload.sub) as AppleUserAuth
      validateResult.appleUser = appleUser
      const user = await getUserFromProviderUserAuth('apple', providerUserAuth(ctx.auth, 'apple', payload.sub))
      const session = await createSession(ctx.auth, user.userId)
      ctx.authRequest?.setSession(session);
      res.session = session
    } else if (input.provider) {
      // Get the authorization URL and store the state in a cookie
      const provider = getAuthProvider(ctx, input.provider)
      const [url, state] = await provider.getAuthorizationUrl()
      ctx.setCookie(`${provider}_oauth_state=${state}; HttpOnly; SameSite=Strict`)
      if (input.redirectTo) {
        // TODO should probably validate the redirect starts with APP_URL, API_URL or t4://
        ctx.setCookie(`${provider}_oauth_redirect=${input.redirectTo}; HttpOnly; SameSite=Strict`)
      }
      res.oauthRedirect = url.toString()
    } if (input.email) {
      if (input.code) {
        res = await signInWithCode(ctx, 'email', input.email, input.code, ctx.setCookie)
        if (res.session?.user?.userId && input.password) {
          // If the user is also resetting their password,
          // update the password, invalidate all sessions, create a new session and return it
          updatePassword(ctx.auth, input.email, input.password)
          await ctx.auth.invalidateAllUserSessions(res.session?.user?.userId)
          const session = await createSession(ctx.auth, res.session?.user?.userId)
          ctx.authRequest?.setSession(session);
          res.session = session
        }
      } else if (input.password) {
        res = await signInWithEmail(ctx.auth, input.email, input.password, ctx.setCookie)
      } else {
        res = await sendEmailSignIn(ctx, input.email)
      }
    // } else if (input.phone) {
    //   if (input.code) {
    //     res = await signInWithPhoneAndCode(ctx.auth, input.phone, input.code, ctx.setCookie)
    //   } else {
    //     res = await sendPhoneSignIn(ctx.auth, input.phone)
    //   }
    }
  } catch (e) {
    if (e instanceof LuciaError && e.message === 'AUTH_INVALID_KEY_ID') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'An account could not be found with this email.',
        cause: e,
      })
    }
    if (e instanceof LuciaError && e.message === 'AUTH_INVALID_PASSWORD') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Sorry, you have entered an invalid email or password.',
        cause: e,
      })
    }
    console.error(e)
    throw e
  }
  return res
}

export const userRouter = router({
  signIn: publicProcedure.input(valibotParser(SignInSchema)).mutation(signIn),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session?.user?.userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be signed in to sign out.',
      })
    }
    return await signOut(ctx.auth, ctx.session.sessionId, ctx.setCookie)
  }),

  signOutEverywhere: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session?.user?.userId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be signed in to sign out of all sessions.',
      })
    }
    return await signOutEverywhere(ctx.auth, ctx.session.user.userId, ctx.setCookie)
  }),

  session: publicProcedure.query(({ ctx }) => {
    return { session: ctx.session }
  }),
  sessions: protectedProcedure.query(getSessions),
  current: protectedProcedure.query(getUser),

  create: publicProcedure.input(valibotParser(CreateUserSchema)).mutation(async ({ ctx, input }) => {
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
          ctx, input: {
            email: input.email,
            password: input.password,
          }
        })
      }

      try {
        const user = await createUser(ctx.auth, input.email, input.password, {
          email: input.email,
        })
        // TODO sanitize the phone number and add it as a user key
        // if (input.phone) {
        //   const phoneAuthMethod = await ctx.auth.createKey({
        //     userId: user.userId,
        //     providerId: 'phone',
        //     providerUserId: user.phone,
        //     password: null,
        //   })
        // }

        const session = await createSession(ctx.auth, user.userId)
        ctx.authRequest?.setSession(session);
        return { session }
      } catch (e) {
        if (e instanceof LuciaError && e.message === `AUTH_DUPLICATE_KEY_ID`) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: `A user already exists with this email: ${input.email}`,
          })
        }
        throw e
      }
    }),
})
