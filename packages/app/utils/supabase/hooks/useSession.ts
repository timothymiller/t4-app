import { SessionContext } from 'app/provider/auth'
import { useContext } from 'react'

export const useSession = () => useContext(SessionContext)
