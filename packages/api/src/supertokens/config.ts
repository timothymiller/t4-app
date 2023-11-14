import type { TypeInput } from 'supertokens-node/types'
import SuperTokens from 'supertokens-node'
import Session from 'supertokens-node/recipe/session'
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword'

// https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
const SUPERTOKENS_CONNECTION_URI = 'https://try.supertokens.com'
const SUPERTOKENS_API_KEY = ''
const API_DOMAIN = 'http://localhost:8787'
const WEBSITE_DOMAIN = 'http://localhost:3000'

export const superTokensConfig: TypeInput = {
  framework: 'custom',
  supertokens: {
    connectionURI: SUPERTOKENS_CONNECTION_URI,
    apiKey: SUPERTOKENS_API_KEY,
  },
  appInfo: {
    appName: 'T4 App',
    apiDomain: API_DOMAIN,
    websiteDomain: WEBSITE_DOMAIN,
    apiBasePath: '/api/auth',
  },
  recipeList: [
    ThirdPartyEmailPassword.init({
      emailDelivery: {
        override: (originalImplementation) => {
          return {
            ...originalImplementation,
            sendEmail: async function (input) {
              const request = SuperTokens.getRequestFromUserContext(input.userContext)
              const platform = request?.getHeaderValue('X-Platform') ?? 'web'
              if (input.type === 'PASSWORD_RESET') {
                return originalImplementation.sendEmail({
                  ...input,
                  passwordResetLink: input.passwordResetLink.replace(
                    // This is: `${websiteDomain}/auth/reset-password`
                    `${WEBSITE_DOMAIN}/auth/reset-password`,
                    platform === 'web'
                      ? `${WEBSITE_DOMAIN}/password-reset/update-password`
                      : `t4://password-reset/update-password`
                  ),
                })
              }
              return originalImplementation.sendEmail(input)
            },
          }
        },
      },
    }),
    Session.init(), // initializes session features
  ],
}
