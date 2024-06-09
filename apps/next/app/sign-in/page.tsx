import { SignInScreen } from 'app/features/sign-in/screen'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default function Page() {
  return <SignInScreen />
}
