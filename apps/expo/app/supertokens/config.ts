import Session from 'supertokens-web-js/recipe/session'
import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword'
import ThirdParty from 'supertokens-web-js/recipe/thirdparty'
import { SuperTokensConfig } from 'supertokens-web-js/lib/build/types'
import { replaceLocalhost } from "app/utils/trpc/localhost.native";
import { LockFactory } from './LockFactory'
import { CookieHandler } from './CookieHandler'
import { StorageHandler } from './StorageHandler'

export const superTokensConfig: SuperTokensConfig = {
  appInfo: {
    appName: 'T4 App',
    apiDomain: replaceLocalhost(process.env.EXPO_PUBLIC_API_URL!),
    apiBasePath: '/api/auth',
  },
  recipeList: [
    Session.init({
      tokenTransferMethod: 'header',
      lockFactory: LockFactory
    }),
    ThirdPartyEmailPassword.init(),
    ThirdParty.init(),
  ],
  cookieHandler: () => new CookieHandler(),
  windowHandler: (original) => {
    return {
      ...original,
      localStorage: new StorageHandler(),
      location: {
        ...original.location,
        getHref() {
          console.log(`getHref called`)
          return 't4://'
        },
        setHref(href) {
          console.log('setHref called', href)
        },
        getSearch() {
          console.log(`getSearch called`)

          return 'search'
        },
        getHash() {
          console.log(`getHash called`)
          return 'hash'
        },
        getPathName() {
          console.log(`getPathName called`)
          return 'localhost'
        },
        getHostName() {
          console.log(`getHostName called`)
          return 't4://'
        },
      },
    }
  },
};