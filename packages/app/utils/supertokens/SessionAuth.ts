import Session, { UserInput } from 'supertokens-web-js/recipe/session'
import RecipeModule from 'supertokens-web-js/lib/build/recipe/recipeModule'
import { RecipeEvent } from 'supertokens-web-js/lib/build/recipe/session/types'
import { CreateRecipeFunction } from 'supertokens-web-js/types'

type RecipeEventWithSessionContext = RecipeEvent & { sessionContext: SessionContextUpdate }

type SessionChangeEventListener = (ctx: RecipeEventWithSessionContext) => void

type SessionContextUpdate = {
  doesSessionExist: boolean
  userId: string
  accessTokenPayload: any
}

export class SessionAuth extends RecipeModule<unknown, any> {
  private static instance: SessionAuth
  private static webJSInstance: CreateRecipeFunction<unknown>
  private eventListeners = new Set<SessionChangeEventListener>()

  static init(config: UserInput) {
    if (this.instance === undefined) {
      this.instance = new SessionAuth(config)
      this.webJSInstance = Session.init({
        ...config,
        onHandleEvent: (e: RecipeEvent) => {
          config.onHandleEvent && config.onHandleEvent(e)
          void SessionAuth.getInstanceOrThrow().notifyListeners(e)
        },
      })
    } else {
      console.warn(`SessionAuth has already been initialized`)
    }
    return this.webJSInstance
  }

  static getInstanceOrThrow(): SessionAuth {
    if (this.instance === undefined) {
      throw Error(
        'No instance of SessionAuth found. Make sure to call the Session.init method. See https://supertokens.io/docs/emailpassword/quick-setup/frontend'
      )
    }
    return this.instance
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

  private notifyListeners = async (event: RecipeEvent) => {
    const sessionContext = await this.getSessionContext(event)

    // We copy this.eventListeners into a new array to "freeze" it for the loop
    // We do this to avoid an infinite loop in case one of the listeners causes a new listener to be added (e.g.: through re-rendering)
    Array.from(this.eventListeners).forEach((listener) =>
      listener({
        sessionContext,
        ...event,
      })
    )
  }
}
