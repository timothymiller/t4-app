import { UpdatePasswordScreen } from 'app/features/password-reset/update-password/screen'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Password Reset',
}

export default function Page() {
  return <UpdatePasswordScreen />
}
