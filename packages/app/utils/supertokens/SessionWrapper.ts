import RecipeModule from 'supertokens-web-js/lib/build/recipe/recipeModule'
import { RecipeEvent } from 'supertokens-web-js/lib/build/recipe/session/types'
import Session, { ClaimValidationError, UserInput } from 'supertokens-web-js/recipe/session'
import { CreateRecipeFunction } from 'supertokens-web-js/types'

type RecipeEventWithSessionContext = RecipeEvent & { sessionContext: SessionContextUpdate }

type SessionChangeEventListener = (ctx: RecipeEventWithSessionContext) => void

type SessionContextUpdate = {
  doesSessionExist: boolean
  userId: string
  accessTokenPayload: any
  invalidClaims: ClaimValidationError[]
}

// This wrapper utilizes the Session recipe from supertokens-web-js, enabling the handling of auth change events seamlessly in both Next and Expo.
// While inspired by the SessionAuth component in the supertokens-auth-react package, it is not a direct replacement.
// If you require additional functionalities offered by that component, it is recommended to use it instead.
export class SessionWrapper extends RecipeModule<unknown, any> {
  private static instance: SessionWrapper
  private static webJSInstance: CreateRecipeFunction<unknown>
  private eventListeners = new Set<SessionChangeEventListener>()

  static init(config: UserInput) {
    if (this.instance === undefined) {
      this.instance = new SessionWrapper(config)
      this.webJSInstance = Session.init({
        ...config,
        onHandleEvent: (e: RecipeEvent) => {
          config.onHandleEvent?.(e)
          void SessionWrapper.getInstanceOrThrow().notifyListeners(e)
        },
      })
    } else {
      console.warn('SessionAuth has already been initialized')
    }
    return this.webJSInstance
  }

  static getInstanceOrThrow(): SessionWrapper {
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

      const invalidClaims = await Promise.resolve(Session.validateClaims({ userContext })).catch(
        async (e) => {
          if (await Session.doesSessionExist({ userContext })) {
            throw e
          }
          return []
        }
      )

      return {
        doesSessionExist: true,
        accessTokenPayload,
        userId,
        invalidClaims,
      }
    }

    if (action === 'SIGN_OUT' || action === 'UNAUTHORISED') {
      return {
        doesSessionExist: false,
        accessTokenPayload: {},
        userId: '',
        invalidClaims: [],
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
    for (const listener of Array.from(this.eventListeners)) {
      listener({ sessionContext, ...event })
    }
  }
}
