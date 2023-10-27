import { Input } from 'valibot';
import { trpc } from '../trpc'
import { storeSessionToken } from './credentials'
import type { SessionUser, Session, SignInResult } from '@t4/api/src/auth/user'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { useSupabase } from '../supabase/hooks/useSupabase'
import { useRouter } from 'solito/router'
import type { AuthProviderName } from '@t4/api/src/auth/shared'
import { CreateUserSchema } from '@t4/api/src/schema/user';
import { isWeb } from '@t4/ui/src';

export const AUTH_SERVICE: 'lucia' | 'supabase' = 'lucia'
// ^ We could maybe configure which auth service to use
// Or use a generator to scaffold different code depending on which is chosen...

export const useSessionContext = () => {
  // Note: this should only be loaded once in the tree by the Provider
  const sessionQuery = trpc.user.session.useQuery(undefined, {
    refetchInterval: 300000, // 300 seconds = 5 minutes
  })
  const [session, setSession] = useSessionAtom()
  const [isLoadingSession, setIsLoadingSession] = useIsLoadingSession()

  useEffect(() => {
    if (!sessionQuery.isFetching && isLoadingSession) {
      setIsLoadingSession(false)
    }
    if (sessionQuery.data?.session === session || sessionQuery.isFetching) return
    // Web is not as secure as native, so just use http-only cookies for auth
    if (!isWeb) {
      storeSessionToken(sessionQuery.data?.session?.sessionId)
    }
    setSession(sessionQuery.data?.session || null)
  }, [sessionQuery.data, session, isLoadingSession])

  return { session, isLoading: isLoadingSession }
}

const sessionAtom = atom<Session | null>(null)

export function useSessionAtom() {
  return [...useAtom(sessionAtom)] as const
}

const isLoadingSessionAtom = atom(true)

export function useIsLoadingSession() {
  return [...useAtom(isLoadingSessionAtom)] as const
}

export function useSignOut() {
  const utils = trpc.useUtils()

  const invalidate = () => {
    // could just invalidate all... utils.invalidate()
    utils.auth.secretMessage.invalidate()
    utils.user.session.invalidate()
  }

  if (AUTH_SERVICE === 'supabase') {
    const supabase = useSupabase();
    const signOut = async () => {
      supabase.auth.signOut()
      invalidate()
    }
    return { signOut }
  } else {
    const mutation = trpc.user.signOut.useMutation()
    const signOut = async () => {
      const res = await mutation.mutateAsync()
      if (res.success) {
        invalidate()
      }
      return res.success
    }
    return {
      signOut,
    }
  }
}

export type SignInWithEmailAndPassword = {
  email: string
  password: string
}

export type SignInWithEmail = {
  email: string
}

export type SignInWithEmailAndCode = {
  email: string
  code: string
}

export type SignInWithPhone = {
  phone: string
}

export type SignInWithPhoneAndCode = {
  phone: string
  code: string
}

export type SignInWithAppleIdTokenAndNonce = {
  provider: 'apple'
  token: string
  nonce: string
}

export type SignInWithOAuth = {
  provider: AuthProviderName
  redirectTo?: string
}


export type SignInProps =
  | SignInWithEmailAndPassword
  | SignInWithEmail
  | SignInWithEmailAndCode
  | SignInWithPhone
  | SignInWithPhoneAndCode
  | SignInWithAppleIdTokenAndNonce
  | SignInWithOAuth

export function isSignInWithEmail(props: SignInProps): props is SignInWithEmail {
  return props['email'] && !props['password']
}

export function isSignInWithEmailAndCode(props: SignInProps): props is SignInWithEmailAndCode {
  return props['email'] && props['code']
}

export function isSignInWithPhone(props: SignInProps): props is SignInWithPhone {
  return props['phone'] && !props['password']
}

export function isSignInWithPhoneAndCode(props: SignInProps): props is SignInWithPhoneAndCode {
  return props['phone'] && props['code']
}

export function isSignInWithEmailAndPassword(
  props: SignInProps
): props is SignInWithEmailAndPassword {
  return props['email'] && props['password']
}

export function isSignInWithOAuth(props: SignInProps): props is SignInWithOAuth {
  return props['provider'] && !props['token'] && !props['nonce']
}

export function isSignInWithAppleIdTokenAndNonce(props: SignInProps): props is SignInWithAppleIdTokenAndNonce {
  return props['provider'] === 'apple' && props['token'] && props['nonce']
}


export function useSignIn() {
  // TODO ^ maybe accept props for what to do after sign in?

  const mutation = trpc.user.signIn.useMutation()
  const utils = trpc.useUtils()
  const postLogin = (res: SignInResult) => {
    // We _could_ call setSessionAtom here and store the session ID for native...
    // but it's a bit simpler to centralize all of the session
    // logic around the user.session trpc query (see useSessionContext() above).
    // It causes a redundant db queries and API roundtrip though...
    // It might be possible to update the trpc user.session cache manually
    // so we can keep the logic centralized around the user.session query while
    // avoiding the additional request.
    utils.user.invalidate()
    utils.auth.invalidate()
  }

  // Might want to useMemo here...
  const signIn = async (props: SignInProps) => {
    if (isSignInWithEmailAndPassword(props)) {
      const res = await mutation.mutateAsync(props)
      postLogin(res)
      return res
    }
    if (isSignInWithAppleIdTokenAndNonce(props)) {
      const res = await mutation.mutateAsync(props)
      if (res.session) {
        postLogin(res)
      }
      return res
    }
    if (isSignInWithOAuth(props)) {
      return await mutation.mutateAsync(props)
    }
    if (isSignInWithEmail(props)) {
      return await mutation.mutateAsync(props)
    }
    if (isSignInWithEmailAndCode(props)) {
      const res = await mutation.mutateAsync(props)
      postLogin(res)
      return res
    }
    if (isSignInWithPhone(props)) {
      throw new Error('Sign in with phone is not implemented yet')
      // const res = await mutation.mutateAsync(props)
      // TODO should switch to a view to enter the sms code
      // return res
    }
    if (isSignInWithPhoneAndCode(props)) {
      const res = await mutation.mutateAsync(props)
      postLogin(res)
      return res
    }
  }

  return { signIn, mutation }
}

export function useSignUp() {
  const mutation = trpc.user.create.useMutation()
  const utils = trpc.useUtils()
  const postLogin = (res: SignInResult) => {
    utils.user.invalidate()
    utils.auth.invalidate()
  }

  const signUp = async (props: Input<typeof CreateUserSchema>) => {
    const res = await mutation.mutateAsync(props)
    postLogin(res)
    return res
  }

  return { signUp, mutation }
}

export interface UseSessionProps {
  required?: boolean
  onUnauthenticated?: () => void
}

export type UseSessionResponse = {
  session?: Session | null
  user?: SessionUser
  isLoadingSession: boolean
}

export function useSession(props?: UseSessionProps): UseSessionResponse {
  const [session] = useSessionAtom()
  const [isLoadingSession] = useIsLoadingSession()
  return {
    session,
    isLoadingSession,
    user: session?.user,
  }
}

export type SessionRedirectProps = {
  true?: string
  false?: string
}


/**
 * Sets up automatically switching to a different page based on whether the user
 * is signed in or not Pass in an object with "true" and "false" keys. If the
 * current user is signed in, it will redirect to the "true" path. If the
 * current user is signed out, it will redirect to the "false" path.
 *
 * Examples:
 * ```
 * useSessionRedirect({ true: '/' }})
 * useSessionRedirect({ false: '/login' }})
 * ```
 */
export function useSessionRedirect(
  props: SessionRedirectProps = { true: '/', false: '/' }
) {
  const { session, isLoadingSession } = useSession()
  const { push } = useRouter()

  useEffect(() => {
    if (isLoadingSession) {
      return
    }
    if (session?.user) {
      if (props.true) {
        push(props.true)
      }
    } else {
      if (props.false) {
        push(props.false)
      }
    }
  }, [session, isLoadingSession])
}

export * from 'app/utils/auth/validation'

export type { Session }
