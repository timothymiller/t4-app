import jwt, { JwtData } from '@tsndr/cloudflare-worker-jwt';
import { createKeyId, Session, User as SessionUser } from 'lucia'
import { Auth } from './shared'
import { UserKeyTable, User, VerificationCodeTable, UserTable } from '../db/schema'
import { ApiContextProps } from '../context'
import { and, eq } from 'drizzle-orm'
import { createCode, createId } from '../utils/id';
import { isWithinExpiration } from 'lucia/utils';
import { TRPCError } from '@trpc/server';

export { Session, SessionUser }

export function isSessionUser(user: User | SessionUser): user is SessionUser {
  return !!(user as SessionUser).userId
}

export function isUser(user: User | SessionUser): user is User {
  return !!(user as User).id
}

export const userToAuthUserAttributes = (user: Partial<User>): Lucia.DatabaseUserAttributes => ({
  email: user.email || null,
})

export const createUser = async (
  auth: Auth,
  email: string,
  password: string | undefined | null,
  user: Partial<User>
): Promise<SessionUser> => {
  return await auth.createUser({
    key: {
      providerId: 'email',
      providerUserId: email,
      password: password || null,
    },
    attributes: userToAuthUserAttributes(user),
  })
}

export function getUserId(user: SessionUser | User) {
  return isSessionUser(user) ? user.userId : user.id
}

export const updateAuthEmail = async (
  ctx: ApiContextProps,
  user: User | SessionUser,
  email: string
) => {
  // Lucia doesn't give us a way to do this... but we can just make the database updates directly
  const userId = getUserId(user)
  const res = await ctx.db
    .update(UserKeyTable)
    .set({ id: createKeyId('email', email) })
    .where(
      and(
        user.email ? eq(UserKeyTable.id, createKeyId('email', user.email)) : undefined,
        eq(UserKeyTable.userId, userId)
      )
    )
  return res
}

export const updatePassword = async (auth: Auth, email: string, password: string | null) => {
  return await auth.updateKeyPassword('email', email, password)
}

export type SignInResult = {
  session?: Session | null
  message?: string
  codeSent?: boolean,
  oauthState?: string | null,
  oauthRedirect?: string,
}

export const signInWithEmail = async (
  auth: Auth,
  email: string,
  password: string,
  setCookie?: (value: string) => void
): Promise<SignInResult> => {
  // These can create errors, but maybe just let them pass through rather than catch them?
  const key = await auth.useKey('email', email, password)
  const session = await createSession(auth, key.userId)
  if (setCookie) {
    const cookie = auth.createSessionCookie(session)
    setCookie(cookie.serialize())
  }
  return { session }
}

export const sendEmailSignIn = async (ctx: ApiContextProps, email: string) => {
  const key = await ctx.auth.getKey('email', email)
  if (!key) {
    throw new Error('No user found with that email.')
  }
  const props = {
    code: createCode(),
    expires: new Date(Date.now() + 1000 * 60 * 5), // 5 minutes
  }
  await ctx.db.insert(VerificationCodeTable).values({
    id: createId(),
    userId: key.userId,
    ...props
  }).onConflictDoUpdate({ target: VerificationCodeTable.userId, set: props })
  const resetLink = ctx.env.APP_URL + '/password-reset/update-password?code=' + encodeURIComponent(props.code) + '&email=' + encodeURIComponent(email)

  if (ctx.env.RESEND_API_KEY) {
    // send email
    const sendResult = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ctx.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: ctx.env.NEXT_PUBLIC_SUPPORT_EMAIL,
        to: email,
        subject: 'T4 App verification code',
        html: `<p>This email was used to sign in to ${ctx.env.APP_URL}.</p>
          <p><a href="${resetLink.replaceAll('&', '&amp;')}">Click here to continue to sign in.</a></p>
          <p>Code: ${props.code}</p>
          <p>If you did not request this code, you can ignore this email or reply to let us know.</p>
        `
      })
    });
    // TODO check sendResult response for success
    return { codeSent: true }
  }
  throw new TRPCError({ message: `Sending the access code ${props.code} to ${email} has not been implemented. It should email a link to ${resetLink}.`, code: "METHOD_NOT_SUPPORTED" })
}

export const signInWithCode = async (
  ctx: ApiContextProps,
  providerId: string,
  providerUserId: string,
  code: string,
  setCookie?: (value: string) => void
) => {
  const key = await ctx.auth.getKey(providerId, providerUserId)
  if (!key) {
    // Note... you might want to create a user here
    // or throw a more generic error if you don't want
    // to expose that the user doesn't exist
    throw new Error('Unable to find account where ' + providerId + ' is ' + providerUserId)
  }
  const verificationCode = (await ctx.db
    .select()
    .from(VerificationCodeTable)
    .where(
      and(
        eq(VerificationCodeTable.userId, key.userId)
      )
    ))?.[0]

  if (!verificationCode || !isWithinExpiration(verificationCode?.expires.getTime())) {
    // optionally send a new code instead of an error
    throw new TRPCError({ message: "Expired verification code", code: "NOT_FOUND" });
  }

  if (verificationCode.timeoutUntil && !isWithinExpiration(verificationCode.timeoutUntil.getTime())) {
    throw new TRPCError({ message: "Too many requests", code: "TOO_MANY_REQUESTS" })
  }


  if (verificationCode.code !== code) {
    // exponential backoff to prevent brute force
    const timeoutSeconds = verificationCode?.timeoutSeconds ? verificationCode.timeoutSeconds * 2 : 1
    const timeoutUntil = new Date(Date.now() + timeoutSeconds * 1000)
    await ctx.db.update(VerificationCodeTable).set({ timeoutUntil, timeoutSeconds }).where(eq(VerificationCodeTable.id, verificationCode.id))
    return {
      message: "Invalid code"
    }
  }

  await ctx.db.delete(VerificationCodeTable).where(eq(VerificationCodeTable.id, verificationCode.id))

  // You may want to sign the user out of other sessions here,
  // but for now, we only do it if the user is changing their password
  // await ctx.auth.invalidateAllUserSessions(user.userId);

  // If you want to require email verification before allowing password-based login
  // you could update a User emailVerified attribute here...
  // await ctx.db.update(UserTable).set({ emailVerified: true }).where(eq(UserTable.id, verificationCode.userId))

  const session = await createSession(ctx.auth, key.userId)
  return {
    session: session,
  }
}

export const sendPhoneSignIn = async (auth: Auth, phone: number) => {
  throw new Error('Password-less sign-in not yet implemented.')
}

export const signInWithPhoneAndCode = async (
  auth: Auth,
  phone: number,
  code: string,
  setCookie?: (value: string) => void
) => {
  throw new Error('Password-less sign-in not yet implemented.')
}

export const signOut = async (
  auth: Auth,
  sessionId: string,
  setCookie?: (value: string) => void
) => {
  await auth.invalidateSession(sessionId)
  if (setCookie) {
    const cookie = auth.createSessionCookie(null)
    setCookie(cookie.serialize())
  }
  return { success: true }
}

export const signOutEverywhere = async (
  auth: Auth,
  userId: string,
  setCookie?: (value: string) => void
) => {
  const res = await auth.invalidateAllUserSessions(userId)
  if (setCookie) {
    const cookie = auth.createSessionCookie(null)
    setCookie(cookie.serialize())
  }
  return { success: true }
}

export const createSession = async (auth: Auth, userId: string) => {
  return await auth.createSession({
    userId,
    attributes: {}, // expects `Lucia.DatabaseSessionAttributes`
  })
}

export const cleanup = async (auth: Auth, userId: string) => {
  return auth.deleteDeadUserSessions(userId)
}


/**
 * Verifies the JWT and returns the payload if it is valid or null if it is not.
 *
 * The verification_key param can be a function to fetch the key from an external source.
 */
export async function getPayloadFromJWT(token: string, verification_key: string | JsonWebKey | ((decodedToken: JwtData) => Promise<string | JsonWebKey>)) {
  const decodedToken = jwt.decode(token)

  // Check if token is expired
  const expirationTimestamp = decodedToken.payload.exp
  const currentTimestamp = Math.floor(Date.now() / 1000)
  if (!expirationTimestamp || expirationTimestamp < currentTimestamp) {
    return null
  }

  const key = (typeof verification_key === 'function') ? await verification_key(decodedToken) : verification_key
  const authorized = await jwt.verify(token, key, {
    algorithm: decodedToken.header.alg,
  })
  if (!authorized) {
    return null
  }

  return decodedToken?.payload
}
