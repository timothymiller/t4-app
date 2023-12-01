import React, { createContext, useContext, useEffect, useState } from 'react'
import Session from 'supertokens-web-js/recipe/session'
import { sessionEventManager } from '../SessionEventManager'

type SessionContextValue = {
  isLoading: boolean
  doesSessionExist: boolean
  userId?: string
  accessTokenPayload?: any
  invalidClaims: Session.ClaimValidationError[]
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined)

const useSession = () => {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<SessionContextValue>({
    isLoading: true,
    doesSessionExist: false,
    invalidClaims: [],
  })

  useEffect(() => {
    Session.doesSessionExist().then(async (sessionExists) => {
      if (sessionExists) {
        const [userId, accessTokenPayload] = await Promise.all([
          Session.getUserId(),
          Session.getAccessTokenPayloadSecurely(),
        ])
        const invalidClaims = await Session.validateClaims()
        setSession({
          isLoading: false,
          doesSessionExist: true,
          userId,
          accessTokenPayload,
          invalidClaims,
        })
      } else {
        setSession({
          isLoading: false,
          doesSessionExist: false,
          userId: undefined,
          accessTokenPayload: undefined,
          invalidClaims: [],
        })
      }
    })
  }, [])

  useEffect(() => {
    const removeListener = sessionEventManager.addEventListener((event) => {
      const sessionContextUpdate = event.sessionContext
      setSession({
        isLoading: false,
        doesSessionExist: sessionContextUpdate.doesSessionExist,
        userId: sessionContextUpdate.userId,
        accessTokenPayload: sessionContextUpdate.accessTokenPayload,
      })
    })
    return removeListener
  }, [])

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}

export { SessionProvider, useSession }
