import { SessionWrapper } from 'app/utils/supertokens/SessionWrapper'
import { getApiUrl } from 'app/utils/trpc'
import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword'
import { SuperTokensConfig } from 'supertokens-web-js/types'
import { CookieHandler } from './CookieHandler'
import { LockFactory } from './LockFactory'
import { windowHandler } from './WindowHandler'

export const config: SuperTokensConfig = {
  appInfo: {
    appName: 'T4 App',
    apiDomain: getApiUrl(),
    apiBasePath: '/api/auth',
  },
  recipeList: [
    SessionWrapper.init({
      tokenTransferMethod: 'header',
      lockFactory: LockFactory,
      override: {
        functions(originalImplementation) {
          return {
            ...originalImplementation,
            addXMLHttpRequestInterceptor(input) {
              // We are overriding the XMLHTTPRequest interceptor as it was causing issues and the fetch interceptor works fine
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
