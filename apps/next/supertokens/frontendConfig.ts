import { sessionEventManager } from 'app/utils/supertokens/SessionEventManager'
import Session from 'supertokens-web-js/recipe/session'
import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword'

export const config = {
  appInfo: {
    appName: `${process.env.NEXT_PUBLIC_APP_NAME}`,
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
  ],
}
