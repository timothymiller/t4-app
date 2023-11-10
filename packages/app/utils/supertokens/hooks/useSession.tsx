import React, { createContext, useContext, useState, useEffect } from "react";
import { SessionAuth } from "../SessionAuth";

type SessionContextValue = {
  isLoading: boolean;
  doesSessionExist: boolean;
  userId?: string;
  accessTokenPayload?: any;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<SessionContextValue>({
    isLoading: true,
    doesSessionExist: false,
  });

  useEffect(() => {
    const removeListener = SessionAuth.getInstanceOrThrow().addEventListener(
      (event) => {
        const sessionContextUpdate = (event)
          .sessionContext;
        setSession({
          isLoading: false,
          doesSessionExist: sessionContextUpdate.doesSessionExist,
          userId: sessionContextUpdate.userId,
          accessTokenPayload: sessionContextUpdate.accessTokenPayload,
        });
      }
    );
    return removeListener;
  }, []);

  return (
    <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
  );
};

export { SessionProvider, useSession };
