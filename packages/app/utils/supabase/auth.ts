// shared/auth.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_API_KEY'

// Initialize Supabase client
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

export { supabase, signIn, signUp, signOut, getUser, isUserSignedIn }
