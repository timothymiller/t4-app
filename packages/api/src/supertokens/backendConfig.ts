import SuperTokens from 'supertokens-node'
import Session from 'supertokens-node/recipe/session'
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword'
import Dashboard from 'supertokens-node/recipe/dashboard'
import UserRoles from 'supertokens-node/recipe/userroles'
import type { TypeInput } from 'supertokens-node/types'
import { Bindings } from '../worker'

export function getSuperTokensConfig(env: Bindings): TypeInput {
  return {
    framework: 'custom',
    supertokens: {
      connectionURI: env.SUPERTOKENS_CONNECTION_URI,
      apiKey: env.SUPERTOKENS_API_KEY,
    },
    appInfo: {
      appName: env.APP_NAME,
      apiDomain: env.API_URL,
      websiteDomain: env.APP_URL,
      apiBasePath: '/api/auth',
    },
    recipeList: [
      ThirdPartyEmailPassword.init({
        providers: [
          {
            config: {
              thirdPartyId: 'discord',
              clients: [
                {
                  // No clientSecret is needed for Discord as it uses PKCE
                  clientId: env.DISCORD_CLIENT_ID,
                },
              ],
            },
          },
          {
            config: {
              thirdPartyId: 'google',
              clients: [
                {
                  clientId: env.GOOGLE_CLIENT_ID,
                  clientSecret: env.GOOGLE_CLIENT_SECRET,
                },
              ],
            },
          },
          {
            config: {
              thirdPartyId: 'apple',
              clients: [
                {
                  clientId: env.APPLE_CLIENT_ID,
                  additionalConfig: {
                    keyId: env.APPLE_KEY_ID,
                    privateKey: env.APPLE_PRIVATE_KEY,
                    teamId: env.APPLE_TEAM_ID,
                  },
                },
              ],
            },
          },
        ],
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
                      `${env.APP_URL}/auth/reset-password`,
                      platform === 'web'
                        ? `${env.APP_URL}/password-reset/update-password`
                        : 't4://password-reset/update-password'
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
      Dashboard.init(), // For more info - https://supertokens.com/docs/thirdpartyemailpassword/custom-ui/init/dashboard
      UserRoles.init(), // For more info - https://supertokens.com/docs/thirdpartyemailpassword/user-roles/initialisation
    ],
  }
}
