import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from './cache'

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (typeof publishableKey === 'undefined')
    throw new Error(
      'Clerk API key not found. Please add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file.'
    )

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {children}
    </ClerkProvider>
  )
}
