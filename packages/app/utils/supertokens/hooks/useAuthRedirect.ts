import { useEffect } from 'react'
import { useRouter } from 'solito/router'
import { SessionAuth } from "../SessionAuth";

export const useAuthRedirect = () => {
  const router = useRouter()
  useEffect(() => {
    const removeListener = SessionAuth.getInstanceOrThrow().addEventListener(
      (event) => {
        if (event.action === 'SIGN_OUT') {
          router.replace('/')
        }
      }
    );
    return removeListener;
  }, []);
}
