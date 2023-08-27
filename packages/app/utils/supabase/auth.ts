import type { SignInWithOAuthCredentials, User, UserResponse } from '@supabase/supabase-js'
import { Linking } from 'react-native'
import { supabase } from './init'
import { useEffect } from 'react'
import { useSupabaseUser, useUserLoading } from '@t4/ui/src/atoms/auth'

const signIn = async (email, password) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  return { user, error }
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
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email: email,
    password: password,
  })

  return { user, error }
}

const signOut = async () => {
  await supabase.auth.signOut()
}

const sendPasswordResetEmail = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/password-reset/update-password`,
  })
  return { data, error }
}

const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  return { data, error }
}

const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  return { user, error }
}

const deleteUser = async (userId) => {
  const { data, error } = await supabase.auth.admin.deleteUser(
    userId
  )

  return {data, error};
}

// @link https://t4stack.com/hooks
const useUser = () => {
  const [user, setUser] = useSupabaseUser()
  const [loading, setLoading] = useUserLoading()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response: UserResponse = await supabase.auth.getUser()
        const user = response?.data?.user
        setUser(user)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, setUser }
}

export {
  supabase,
  signIn,
  signInWithOAuth,
  sendPasswordResetEmail,
  updatePassword,
  signUp,
  signOut,
  getUser,
  deleteUser,
  useUser,
}
