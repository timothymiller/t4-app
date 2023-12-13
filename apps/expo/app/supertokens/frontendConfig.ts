import { getApiUrl } from 'app/utils/trpc'
import Session from 'supertokens-web-js/recipe/session'
import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword'
import { SuperTokensConfig } from 'supertokens-web-js/types'
import { CookieHandler } from './CookieHandler'
import { LockFactory } from './LockFactory'
import { windowHandler } from './WindowHandler'
import { sessionEventManager } from 'app/utils/supertokens/SessionEventManager'

export const config: SuperTokensConfig = {
  appInfo: {
    appName: `${process.env.EXPO_PUBLIC_APP_NAME}`,
    apiDomain: getApiUrl(),
    apiBasePath: '/api/auth',
  },
  recipeList: [
    Session.init({
      tokenTransferMethod: 'header',
      lockFactory: LockFactory,
      onHandleEvent: (e) => {
        sessionEventManager.notifyListeners(e)
      },
      override: {
        functions(originalImplementation) {
          return {
            ...originalImplementation,
            addXMLHttpRequestInterceptor(input) {
              // We are overriding the XMLHTTPRequest interceptor as it was causing issues and the fetch interceptor works fine
              // If you want to use axios instead of fetch you can follow the instructions here - https://supertokens.com/docs/thirdpartyemailpassword/custom-ui/handling-session-tokens#for-react-native
            },
          }
        },
      },
    }),
    ThirdPartyEmailPassword.init(),
  ],
  cookieHandler: () => new CookieHandler(),
  windowHandler,
}
