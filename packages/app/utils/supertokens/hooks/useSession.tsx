import React, { createContext, useContext, useState, useEffect } from 'react'
import Session from 'supertokens-web-js/recipe/session'
import { SessionAuth } from '../SessionAuth'

type SessionContextValue = {
  isLoading: boolean
  doesSessionExist: boolean
  userId?: string
  accessTokenPayload?: any
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
  })

  useEffect(() => {
    Session.doesSessionExist().then(async (sessionExists) => {
      if (sessionExists) {
        try {
          const [userId, accessTokenPayload] = await Promise.all([
            Session.getUserId(),
            Session.getAccessTokenPayloadSecurely(),
          ])
          setSession({ isLoading: false, doesSessionExist: true, userId, accessTokenPayload })
        } catch {
          setSession({
            isLoading: false,
            doesSessionExist: false,
            userId: undefined,
            accessTokenPayload: undefined,
          })
        }
      }
    })
  }, [])

  useEffect(() => {
    const removeListener = SessionAuth.getInstanceOrThrow().addEventListener((event) => {
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
