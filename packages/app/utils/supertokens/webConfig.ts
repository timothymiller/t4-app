import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword'
import { SessionAuth } from './SessionAuth';

export const webConfig = {
  appInfo: {
    appName: 'T4 App',
    apiDomain: process.env.NEXT_PUBLIC_API_URL!,
    apiBasePath: '/api/auth',
  },
  recipeList: [
    SessionAuth.init({
      onHandleEvent: (event) => {
        console.log('onHandleEvent: event', event)
      },
    }),
    ThirdPartyEmailPassword.init(),
  ],
}

