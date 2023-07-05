// shared/auth.js

import { SignInWithOAuthCredentials, createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY as string

const supabase = createClient(supabaseUrl, supabaseKey)

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

  return { user, error, access_token, refresh_token }
}

const signInWithOAuth = async (credentials: SignInWithOAuthCredentials) => {
  const { data, error } = await supabase.auth.signInWithOAuth(credentials)

  if (error) {
    console.log('Sign in with OAuth failed', error)
    return
  }
  if (data?.url) {
    // redirect the user to the identity provider's authentication flow
    window.location.href = data.url
  }
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

  return { user, error }
}

const signOut = async () => {
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
    error,
  } = await supabase.auth.getSession()
  return session !== null && session.user !== null
}

export { supabase, signIn, signInWithOAuth, signUp, signOut, getUser, isUserSignedIn }
