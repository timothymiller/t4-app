import { PasswordResetScreen } from 'app/features/password-reset/screen'
import Head from 'next/head'

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
