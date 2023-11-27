import { SessionWrapper } from 'app/utils/supertokens/SessionWrapper'
import ThirdParty from 'supertokens-web-js/recipe/thirdparty'
import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword'

export const config = {
  appInfo: {
    appName: 'T4 App',
    apiDomain: `${process.env.NEXT_PUBLIC_API_URL}`,
    apiBasePath: '/api/auth',
  },
  recipeList: [SessionWrapper.init({}), ThirdPartyEmailPassword.init(), ThirdParty.init()],
}
