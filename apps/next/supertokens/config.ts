import { sessionEventManager } from 'app/utils/supertokens/SessionEventManager'
import ThirdParty from 'supertokens-web-js/recipe/thirdparty'
import Session from 'supertokens-web-js/recipe/session'
import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword'

export const config = {
  appInfo: {
    appName: 'T4 App',
    apiDomain: `${process.env.NEXT_PUBLIC_API_URL}`,
    apiBasePath: '/api/auth',
  },
  recipeList: [
    Session.init({
      onHandleEvent: (e) => {
        sessionEventManager.notifyListeners(e)
      },
    }),
    ThirdPartyEmailPassword.init(),
    ThirdParty.init(),
  ],
}
