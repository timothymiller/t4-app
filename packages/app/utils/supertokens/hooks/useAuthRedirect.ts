import { useEffect } from 'react'
import { useRouter } from 'solito/router'
import { SessionWrapper } from '../SessionWrapper'

export const useAuthRedirect = () => {
  const router = useRouter()
  useEffect(() => {
    const removeListener = SessionWrapper.getInstanceOrThrow().addEventListener((event) => {
      if (event.action === 'SIGN_OUT' || event.action === 'UNAUTHORISED') {
        router.replace('/')
      }
    })
    return removeListener
  }, [router])
}
