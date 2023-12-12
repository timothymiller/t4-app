import { ApiContextProps } from '../context'
import { AuthMethodTable, SessionTable, User, UserTable } from '../db/schema'
import { createId } from '../utils/id'
import { hashPassword, verifyPassword } from '../utils/password'
import { DEFAULT_HASH_METHOD } from '../utils/password/hash-methods'
import { TRPCError } from '@trpc/server'
import { and, eq, lt } from 'drizzle-orm'
import type { RegisteredLucia, Session } from 'lucia'
import { isWithinExpirationDate } from 'oslo'
import { createCode, createTotpSecret, verifyCode } from '../utils/crypto'
import { AuthProviderName } from './providers'
import { OAuth2RequestError } from 'arctic'
import { getOAuthUser } from './shared'

export const createAuthMethodId = (providerId: string, providerUserId: string) => {
  if (providerId.includes(':')) {
    throw new TypeError('Provider id must not include any colons (:)')
  }
  return `${providerId}:${providerUserId}`
}

export { Session }

export async function getAuthMethod(ctx: ApiContextProps, authMethodId: string) {
  return await ctx.db.query.AuthMethodTable.findFirst({
    where: eq(AuthMethodTable.id, authMethodId),
  })
}

export async function getUserById(ctx: ApiContextProps, id: string) {
  return await ctx.db.query.UserTable.findFirst({ where: eq(UserTable.id, id) })
}

export async function getUserByEmail(ctx: ApiContextProps, email: string) {
  const existingAuthMethod = await ctx.db.query.AuthMethodTable.findFirst({
    where: eq(AuthMethodTable.id, createAuthMethodId('email', email)),
  })
  if (existingAuthMethod) {
    const user = await ctx.db.query.UserTable.findFirst({
      where: eq(UserTable.id, existingAuthMethod.userId),
    })
    if (user) {
      return user
    }
  }
  return false
}

export const createUser = async (
  ctx: ApiContextProps,
  providerId: string,
  providerUserId: string, // email
  password: string | undefined | null,
  user: Partial<User>
): Promise<User> => {
  const userId = user.id || createId()
  const authMethodId = createAuthMethodId(providerId, providerUserId)
  const existing = await ctx.db.query.AuthMethodTable.findFirst({
    where: eq(AuthMethodTable.id, authMethodId),
  })
  if (existing) {
    const existingUser = await ctx.db.query.UserTable.findFirst({
      where: eq(UserTable.id, existing.userId),
    })
    if (existingUser) {
      throw new TRPCError({ message: 'User exists', code: 'CONFLICT' })
    }
    await ctx.db.delete(AuthMethodTable).where(eq(AuthMethodTable.id, authMethodId))
  }

  const { hashedPassword, hashMethod } = password
    ? await hashPassword(password)
    : { hashedPassword: undefined, hashMethod: undefined }
  await ctx.db.insert(UserTable).values({
    ...user,
    email: user.email || '',
    id: userId,
  })
  await ctx.db.insert(AuthMethodTable).values({
    id: authMethodId,
    userId,
    hashedPassword,
    hashMethod,
  })
  const createdUser = await ctx.db.query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
  })
  if (!createdUser) {
    throw new TRPCError({ message: 'Unable to create user', code: 'INTERNAL_SERVER_ERROR' })
  }
  return createdUser
}

/**
 * Admin function to change a user email
 * Consider deleting user sessions after calling this
 */
export const updateAuthEmail = async (ctx: ApiContextProps, user: User, email: string) => {
  const res = await ctx.db
    .update(AuthMethodTable)
    .set({ id: createAuthMethodId('email', email) })
    .where(
      and(
        user.email ? eq(AuthMethodTable.id, createAuthMethodId('email', user.email)) : undefined,
        eq(AuthMethodTable.userId, user.id)
      )
    )
  return res
}

export const updatePassword = async (
  ctx: ApiContextProps,
  email: string,
  password: string | null
) => {
  const authMethodId = createAuthMethodId('email', email)
  const existing = await getAuthMethod(ctx, authMethodId)
  if (!existing) {
    throw new TRPCError({ message: 'User not found', code: 'NOT_FOUND' })
  }
  const { hashedPassword, hashMethod } = password
    ? await hashPassword(password)
    : { hashedPassword: null, hashMethod: null }
  return await ctx.db
    .update(AuthMethodTable)
    .set({
      hashedPassword,
      hashMethod,
    })
    .where(eq(AuthMethodTable.id, authMethodId))
}

export type SignInResult = {
  session?: Session | null
  message?: string
  codeSent?: boolean
  redirectTo?: string
}

export const signInWithEmail = async (
  ctx: ApiContextProps,
  email: string,
  password: string,
  setCookie?: (value: string) => void
): Promise<SignInResult> => {
  const authMethodId = createAuthMethodId('email', email)
  const authMethod = await getAuthMethod(ctx, authMethodId)
  if (!authMethod) {
    throw new TRPCError({ message: 'No user found with that email', code: 'UNAUTHORIZED' })
  }
  if (!authMethod.hashedPassword) {
    throw new TRPCError({
      message: 'Password sign-in is not enabled for this account',
      code: 'UNAUTHORIZED',
    })
  }
  const verifyResult = await verifyPassword(
    password,
    authMethod.hashedPassword,
    authMethod.hashMethod
  )
  if (!verifyResult) {
    // TODO should use similar code to signInWithCode to require backoff or max attempts
    // Maybe should email the user if multiple failed sign-in attempts are detected
    throw new TRPCError({ message: 'Invalid password', code: 'UNAUTHORIZED' })
  }
  if (verifyResult && authMethod.hashMethod !== DEFAULT_HASH_METHOD) {
    await updatePassword(ctx, email, password)
  }
  const session = await createSession(ctx.auth, authMethod.userId)
  if (setCookie) {
    const cookie = ctx.auth.createSessionCookie(session.id)
    setCookie(cookie.serialize())
  }
  return { session }
}

const passwordResetTimeoutSeconds = 300 // 5 minutes

export const sendEmailSignIn = async (ctx: ApiContextProps, email: string) => {
  const authMethod = await getAuthMethod(ctx, createAuthMethodId('email', email))
  if (!authMethod) {
    throw new TRPCError({ message: 'No user found with that email', code: 'UNAUTHORIZED' })
  }
  // Generate a TOTP secret to verify codes
  // While it could be possible to not generate a new secret every time,
  // that opens some security risks if the database is compromised
  // and the secret is leaked. D1 has encryption in rest and in transit,
  // but it could be wise to encrypt the secret with a server-side RSA key
  // so there is a second layer of security.
  // The totpExpires field is only used to determine if validation fails
  // due to an expired code or invalid code.
  const secret = await createTotpSecret()
  await ctx.db.update(AuthMethodTable).set({
    totpExpires: new Date(Date.now() + 1000 * passwordResetTimeoutSeconds),
    totpSecret: secret,
    timeoutUntil: null,
    timeoutSeconds: null,
  })
  const code = await createCode({ seconds: passwordResetTimeoutSeconds, secret })
  const resetLink =
    `${ctx.env.APP_URL}/password-reset/update-password` +
    `?code=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}`

  if (ctx.env.RESEND_API_KEY) {
    // send email
    const sendResult = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ctx.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: ctx.env.PUBLIC_SUPPORT_EMAIL,
        to: email,
        subject: 'T4 App verification code',
        html: `<p>This email was used to sign in to ${ctx.env.APP_URL}.</p>
          <p><a href="${resetLink.replaceAll('&', '&amp;')}">Click here to continue to sign in.</a></p>
          <p>Code: ${code}</p>
          <p>If you did not request this code, you can ignore this email or reply to let us know.</p>
        `,
      }),
    })
    // TODO check sendResult response for success
    return { codeSent: true }
  }
  throw new TRPCError({
    message: `Sending the access code ${code} to ${email} has not been implemented. It should email a link to ${resetLink}.`,
    code: 'METHOD_NOT_SUPPORTED',
  })
}

export const signInWithCode = async (
  ctx: ApiContextProps,
  providerId: string,
  providerUserId: string,
  code: string,
  setCookie?: (value: string) => void
) => {
  const authMethodId = createAuthMethodId(providerId, providerUserId)
  const authMethod = await getAuthMethod(ctx, authMethodId)
  if (!authMethod) {
    // Note... you might want to create a user here
    // or throw a more generic error if you don't want
    // to expose that the user doesn't exist
    throw new TRPCError({
      message: `Unable to find account where ${providerId} is ${providerUserId}`,
      code: 'NOT_FOUND',
    })
  }
  if (!authMethod.totpSecret) {
    throw new TRPCError({
      message: `There are no active verification codes where ${providerId} is ${providerUserId}`,
      code: 'TIMEOUT',
    })
  }
  if (authMethod.timeoutUntil && isWithinExpirationDate(authMethod.timeoutUntil)) {
    throw new TRPCError({
      message:
        'Sorry, that was too many attempts to enter the verification code. Please wait a moment and try again.',
      code: 'TOO_MANY_REQUESTS',
    })
  }

  if (
    !(await verifyCode(code, {
      seconds: passwordResetTimeoutSeconds,
      secret: authMethod.totpSecret,
    }))
  ) {
    if (authMethod.totpExpires && !isWithinExpirationDate(authMethod.totpExpires)) {
      throw new TRPCError({ message: 'This verification code has expired.', code: 'TIMEOUT' })
    }
    // exponential backoff to prevent brute force
    const timeoutSeconds = authMethod?.timeoutSeconds ? authMethod.timeoutSeconds * 2 : 1
    const timeoutUntil = new Date(Date.now() + timeoutSeconds * 1000)
    await ctx.db
      .update(AuthMethodTable)
      .set({ timeoutUntil, timeoutSeconds })
      .where(eq(AuthMethodTable.id, authMethod.id))
    throw new TRPCError({ message: 'Invalid verification code', code: 'UNAUTHORIZED' })
  }

  await ctx.db
    .update(AuthMethodTable)
    .set({
      totpSecret: null,
      totpExpires: null,
      timeoutUntil: null,
      timeoutSeconds: null,
    })
    .where(eq(AuthMethodTable.id, authMethod.id))

  // You may want to sign the user out of other sessions here,
  // but for now, we only do it if the user is changing their password
  // await ctx.auth.invalidateUserSessions(authMethod.userId);

  // If you want to require email verification before allowing password-based login
  // you could update a User emailVerified attribute here...
  // await ctx.db.update(UserTable).set({ emailVerified: true }).where(eq(UserTable.id, verificationCode.userId))

  const session = await createSession(ctx.auth, authMethod.userId)
  if (setCookie) {
    const cookie = ctx.auth.createSessionCookie(session.id)
    setCookie(cookie.serialize())
  }
  return {
    session: session,
  }
}

export const signInWithOAuthCode = async (
  ctx: ApiContextProps,
  service: AuthProviderName,
  code: string,
  state?: string,
  storedState?: string,
  redirectTo?: string,
  userData?: Partial<User>
) => {
  if (!storedState || !state || storedState !== state || typeof code !== 'string') {
    throw new TRPCError({ message: 'Invalid state', code: 'BAD_REQUEST' })
  }
  try {
    const user = await getOAuthUser(service, ctx, { code, userData })
    const session = await createSession(ctx.auth, user.id)
    if (ctx.setCookie) {
      ctx.setCookie(ctx.auth.createSessionCookie(session.id).serialize())
    }
    return { redirectTo: `${redirectTo ? redirectTo : ctx.env.APP_URL}#token=${session.id}` }
  } catch (e) {
    console.error(e)
    if (e instanceof OAuth2RequestError) {
      throw new TRPCError({ message: 'Invalid code', code: 'BAD_REQUEST' })
    }
    throw new TRPCError({ message: 'Unknown auth error', code: 'INTERNAL_SERVER_ERROR' })
  }
}

export const sendPhoneSignIn = async (ctx: ApiContextProps, phone: number) => {
  throw new Error('Password-less sign-in not yet implemented.')
}

export const signInWithPhoneAndCode = async (
  ctx: ApiContextProps,
  phone: number,
  code: string,
  setCookie?: (value: string) => void
) => {
  throw new Error('Password-less sign-in not yet implemented.')
}

export const signOut = async (
  auth: RegisteredLucia,
  sessionId: string,
  setCookie?: (value: string) => void
) => {
  await auth.invalidateSession(sessionId)
  if (setCookie) {
    const cookie = auth.createBlankSessionCookie()
    setCookie(cookie.serialize())
  }
  return { success: true }
}

export const signOutEverywhere = async (
  auth: RegisteredLucia,
  userId: string,
  setCookie?: (value: string) => void
) => {
  const res = await auth.invalidateUserSessions(userId)
  if (setCookie) {
    const cookie = auth.createBlankSessionCookie()
    setCookie(cookie.serialize())
  }
  return { success: true }
}

export const createSession = async (auth: RegisteredLucia, userId: string) => {
  return await auth.createSession(userId, {})
}

export const cleanup = async (context: ApiContextProps, userId?: string) => {
  return await context.db
    .delete(SessionTable)
    .where(
      and(
        userId ? eq(SessionTable.userId, userId) : undefined,
        lt(SessionTable.expiresAt, new Date().getTime())
      )
    )
}
