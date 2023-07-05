import { SignInWithOAuthCredentials } from '@supabase/supabase-js'
import { Linking } from 'react-native'
import { getToken, saveToken } from './cache'
import { supabase } from './init'

// Authentication methods
const signIn = async (email, password) => {
  const {
    data: { user, session },
    error,
  } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
  const access_token = session?.access_token
  const refresh_token = session?.refresh_token

  await saveToken('refresh_token', refresh_token || '')

  return { user, error, access_token, refresh_token }
}

const signInWithOAuth = async (credentials: SignInWithOAuthCredentials) => {
  const { data, error } = await supabase.auth.signInWithOAuth(credentials)

  if (data?.url) {
    // Redirect the user to the identity provider's authentication flow
    Linking.openURL(data.url)
  }

  return { data, error }
}

const signUp = async (email, password) => {
  const {
    data: { user, session },
    error,
  } = await supabase.auth.signUp({
    email: email,
    password: password,
  })

  const access_token = session?.access_token
  const refresh_token = session?.refresh_token

  await saveToken('refresh_token', refresh_token || '')

  return { user, error, access_token, refresh_token }
}

const signOut = async () => {
  await saveToken('refresh_token', '')
  await supabase.auth.signOut()
}

const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return { user, error }
}

const isUserSignedIn = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session === null || session.user === null) {
    const refresh_token = await getToken('refresh_token')

    if (refresh_token && refresh_token !== '') {
      const { data, error } = await supabase.auth.refreshSession({ refresh_token })

      if (error) {
        console.error('Error refreshing session:', error)
        return false
      }

      return data.session !== null && data.user !== null
    }
  }

  return session !== null && session.user !== null
}

export { supabase, signIn, signInWithOAuth, signUp, signOut, getUser, isUserSignedIn }
