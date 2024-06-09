import { SignUpScreen } from 'app/features/sign-up/screen'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
}

export default function Page() {
  return <SignUpScreen />
}
