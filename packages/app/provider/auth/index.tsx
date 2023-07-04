import { createClient } from '@supabase/supabase-js'
import { tokenCache } from './cache'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY ?? ''
  const supabase = createClient(supabaseUrl, supabaseKey)
  // if (typeof publishableKey === 'undefined')
  //   throw new Error(
  //     'Clerk API key not found. Please add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file.'
  //   )

  return <>{children}</>
}
