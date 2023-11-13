import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword'
import { SuperTokensConfig } from 'supertokens-web-js/types'
import { replaceLocalhost } from 'app/utils/trpc/localhost.native'
import { SessionAuth } from 'app/utils/supertokens/SessionAuth'
import { LockFactory } from './LockFactory'
import { CookieHandler } from './CookieHandler'
import { windowHandler } from './WindowHandler'

export const config: SuperTokensConfig = {
  appInfo: {
    appName: 'T4 App',
    apiDomain: replaceLocalhost(process.env.EXPO_PUBLIC_API_URL!),
    apiBasePath: '/api/auth',
  },
  recipeList: [
    SessionAuth.init({
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
