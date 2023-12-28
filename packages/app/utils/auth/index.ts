import { Input } from 'valibot'
import { trpc } from '../trpc'
import { storeSessionToken } from './credentials'
import type { Session, SignInResult } from '@t4/api/src/auth/user'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'
import { useSupabase } from '../supabase/hooks/useSupabase'
import { useRouter } from 'solito/router'
import type { AuthProviderName } from '@t4/api/src/auth/providers'
import { CreateUserSchema } from '@t4/api/src/schema/user'
import { isWeb } from '@t4/ui/src'
import type { User } from '@t4/api/src/db/schema'
import { match } from 'ts-pattern'

export const AUTH_SERVICE: 'lucia' | 'supabase' = 'lucia'
// ^ We could maybe configure which auth service to use
// Or use a generator to scaffold different code depending on which is chosen...

export const useSessionContext = () => {
  // Note: this should only be loaded once in the tree by the Provider
  const sessionQuery = trpc.user.session.useQuery(undefined, {
    refetchInterval: 300000, // 300 seconds = 5 minutes
  })
  const [{ session, user }, setSession] = useSessionAtom()
  const [isLoadingSession, setIsLoadingSession] = useIsLoadingSession()

  useEffect(() => {
    if (!sessionQuery.isFetching && isLoadingSession) {
      setIsLoadingSession(false)
    }
    if (sessionQuery.data?.session === session || sessionQuery.isFetching) return
    // Web is not as secure as native, so just use http-only cookies for auth
    if (!isWeb) {
      storeSessionToken(sessionQuery.data?.session?.id)
    }
    setSession({
      session: sessionQuery.data?.session || null,
      user: sessionQuery.data?.user || null,
    })
  }, [
    setIsLoadingSession,
    setSession,
    sessionQuery.data,
    sessionQuery.isFetching,
    session,
    isLoadingSession,
  ])

  return { session, user, isLoading: isLoadingSession }
}

const sessionAtom = atom<{ session: Session | null; user: User | null }>({
  session: null,
  user: null,
})

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
    const supabase = useSupabase()
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
  idToken: string
  nonce: string
}

export type SignInWithOAuth = {
  provider: AuthProviderName
  redirectTo?: string
  code?: string
  state?: string
  appleUser?: { email?: string }
}

export type SignInProps =
  | SignInWithEmailAndPassword
  | SignInWithEmail
  | SignInWithEmailAndCode
  | SignInWithPhone
  | SignInWithPhoneAndCode
  | SignInWithAppleIdTokenAndNonce
  | SignInWithOAuth

export function isSignInWithEmailAndPassword(
  props: SignInProps
): props is SignInWithEmailAndPassword {
  // biome-ignore lint/complexity/useLiteralKeys: Index access needed for type guard
  return props['email'] && props['password']
}

export function isSignInWithEmailAndCode(props: SignInProps): props is SignInWithEmailAndCode {
  // biome-ignore lint/complexity/useLiteralKeys: Index access needed for type guard
  return props['email'] && props['code']
}

export function isSignInWithEmail(props: SignInProps): props is SignInWithEmail {
  // biome-ignore lint/complexity/useLiteralKeys: Index access needed for type guard
  return props['email'] && !props['password']
}

export function isSignInWithPhoneAndCode(props: SignInProps): props is SignInWithPhoneAndCode {
  // biome-ignore lint/complexity/useLiteralKeys: Index access needed for type guard
  return props['phone'] && props['code']
}

export function isSignInWithPhone(props: SignInProps): props is SignInWithPhone {
  // biome-ignore lint/complexity/useLiteralKeys: Index access needed for type guard
  return props['phone'] && !props['password']
}

export function isSignInWithAppleIdTokenAndNonce(
  props: SignInProps
): props is SignInWithAppleIdTokenAndNonce {
  // biome-ignore lint/complexity/useLiteralKeys: Index access needed for type guard
  return props['provider'] === 'apple' && props['idToken'] && props['nonce']
}

export function isSignInWithOAuth(props: SignInProps): props is SignInWithOAuth {
  // biome-ignore lint/complexity/useLiteralKeys: Index access needed for type guard
  return props['provider'] && !props['idToken'] && !props['nonce']
}

export function useSignIn() {
  // TODO ^ maybe accept props for what to do after sign in

  const mutation = trpc.user.signIn.useMutation()
  const utils = trpc.useUtils()
  const postLogin = (res: SignInResult) => {
    if (!isWeb) {
      storeSessionToken(res.session?.id)
    }
    utils.user.invalidate()
    utils.auth.invalidate()
  }

  // Might want to useCallback here and replace guards with ts-pattern
  const signIn = async (props: SignInProps) => {
    return await match(props)
      .with({}, isSignInWithAppleIdTokenAndNonce, async (props) => {
        const res = await mutation.mutateAsync(props)
        if (res.session) {
          postLogin(res)
        }
        return res
      })
      .with({}, isSignInWithOAuth, async (props) => {
        return await mutation.mutateAsync(props)
      })
      .with({}, isSignInWithEmailAndPassword, async (props) => {
        const res = await mutation.mutateAsync(props)
        postLogin(res)
        return res
      })
      .with({}, isSignInWithEmailAndCode, async (props) => {
        const res = await mutation.mutateAsync(props)
        postLogin(res)
        return res
      })
      .with({}, isSignInWithEmail, async (props) => {
        return await mutation.mutateAsync(props)
      })
      .with({}, isSignInWithPhoneAndCode, async () => {
        throw new Error('Sign in with phone is not implemented yet')
        // const res = await mutation.mutateAsync(props)
        // TODO should switch to a view to enter the sms code
        // return res
      })
      .with({}, isSignInWithPhone, async () => {
        throw new Error('Sign in with phone is not implemented yet')
        // const res = await mutation.mutateAsync(props)
        // TODO should switch to a view to enter the sms code
        // return res
      })
      .exhaustive()
  }

  return { signIn, mutation }
}

export function useSignUp() {
  const mutation = trpc.user.create.useMutation()
  const utils = trpc.useUtils()
  const postLogin = (res: SignInResult) => {
    if (!isWeb) {
      storeSessionToken(res.session?.id)
    }
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
  user?: User | null
  isLoadingSession: boolean
}

export function useSession(props?: UseSessionProps): UseSessionResponse {
  const [{ session, user }] = useSessionAtom()
  const [isLoadingSession] = useIsLoadingSession()
  return {
    session,
    isLoadingSession,
    user,
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
 * useSessionRedirect({ false: '/sign-in' }})
 * ```
 */
export function useSessionRedirect(props: SessionRedirectProps = { true: '/', false: '/' }) {
  const { session, user, isLoadingSession } = useSession()
  const { push } = useRouter()

  useEffect(() => {
    if (isLoadingSession) {
      return
    }
    if (user) {
      if (props.true) {
        push(props.true)
      }
    } else {
      if (props.false) {
        push(props.false)
      }
    }
  }, [user, isLoadingSession, props, push])
}

export type { Session }
