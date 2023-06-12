import { useEffect } from 'react'
import { useSignUp, useUser } from 'app/utils/clerk'
import { handleOAuthSignUp } from 'app/utils/auth'
import { createParam } from 'solito'
import { OAuthStrategy } from '@clerk/types'
import { useRouter } from 'solito/router'
import { trpc } from 'app/utils/trpc'

const { useParam } = createParam<{ strategy: OAuthStrategy }>()

export function SSOOAuthScreen() {
  const { push } = useRouter()
  const { isLoaded, signUp, setSession } = useSignUp()
  const [strategy] = useParam('strategy')
  const { user, isSignedIn } = useUser()

  const createUserMutation = trpc.user.create.useMutation()
  const currentUser = trpc.user.current.useQuery()

  const createUserInDatabase = async (userId, emailAddress) => {
    await createUserMutation.mutate({
      id: userId,
      email: emailAddress,
    })
  }

  useEffect(() => {
    if (!strategy || !setSession) return
    if (isSignedIn && user && currentUser) {
      //in this case, we are assuming that if the user is signedin
      //and they currently don't have a database entry
      //then they are signing up for the first time
      //this is kind of a hack, but it works for now
      createUserInDatabase(user.id, user.primaryEmailAddress!.emailAddress)
      push('/')
    } else {
      handleOAuthSignUp(strategy, setSession, signUp)
    }
  }, [isLoaded, signUp, setSession])
  return <></>
}
