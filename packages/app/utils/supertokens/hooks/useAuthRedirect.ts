import { useEffect } from 'react'
import { useRouter } from 'solito/router'
import { sessionEventManager } from '../SessionEventManager'

export const useAuthRedirect = () => {
  const router = useRouter()
  useEffect(() => {
    const removeListener = sessionEventManager.addEventListener((event) => {
      if (event.action === 'SIGN_OUT' || event.action === 'UNAUTHORISED') {
        router.replace('/')
      }
    })
    return removeListener
  }, [router])
}
