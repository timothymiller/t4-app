import Head from 'next/head'
import { PasswordResetScreen } from 'app/features/password-reset/screen'

export default function Page() {
  return (
    <>
      <Head>
        <title>Password Reset</title>
      </Head>
      <PasswordResetScreen />
    </>
  )
}
