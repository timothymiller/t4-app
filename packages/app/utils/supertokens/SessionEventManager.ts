import { RecipeEvent } from 'supertokens-web-js/lib/build/recipe/session/types'
import Session from 'supertokens-web-js/recipe/session'

type RecipeEventWithSessionContext = RecipeEvent & { sessionContext: SessionContextUpdate }

type SessionChangeEventListener = (ctx: RecipeEventWithSessionContext) => void

type SessionContextUpdate = {
  doesSessionExist: boolean
  userId: string
  accessTokenPayload: any
}

// This class allows us to handle auth change events seamlessly in both Next and Expo.
class SessionEventManager {
  private static instance: SessionEventManager | null = null
  private eventListeners: Set<SessionChangeEventListener>

  private constructor() {
    this.eventListeners = new Set()
  }

  static getInstance(): SessionEventManager {
    if (!SessionEventManager.instance) {
      SessionEventManager.instance = new SessionEventManager()
    }
    return SessionEventManager.instance
  }

  private async getSessionContext({
    action,
    userContext,
  }: RecipeEvent): Promise<SessionContextUpdate> {
    if (
      action === 'SESSION_CREATED' ||
      action === 'REFRESH_SESSION' ||
      action === 'API_INVALID_CLAIM' ||
      action === 'ACCESS_TOKEN_PAYLOAD_UPDATED'
    ) {
      const [userId, accessTokenPayload] = await Promise.all([
        Session.getUserId({
          userContext,
        }),
        Session.getAccessTokenPayloadSecurely({
          userContext,
        }),
      ])

      return {
        doesSessionExist: true,
        accessTokenPayload,
        userId,
      }
    }

    if (action === 'SIGN_OUT' || action === 'UNAUTHORISED') {
      return {
        doesSessionExist: false,
        accessTokenPayload: {},
        userId: '',
      }
    }

    throw new Error(`Unhandled recipe event: ${action}`)
  }

  /**
   * @returns Function to remove event listener
   */
  addEventListener = (listener: SessionChangeEventListener): (() => void) => {
    this.eventListeners.add(listener)
    return () => this.eventListeners.delete(listener)
  }

  notifyListeners = async (event: RecipeEvent) => {
    const sessionContext = await this.getSessionContext(event)

    // We copy this.eventListeners into a new array to "freeze" it for the loop
    // We do this to avoid an infinite loop in case one of the listeners causes a new listener to be added (e.g.: through re-rendering)
    for (const listener of Array.from(this.eventListeners)) {
      listener({ sessionContext, ...event })
    }
  }
}

export const sessionEventManager = SessionEventManager.getInstance()
