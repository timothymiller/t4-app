import { Context, Next } from 'hono'
import { STHonoRequest, STHonoResponse } from './hono'
import { makeDefaultUserContextFromAPI } from 'supertokens-node/lib/build/utils'
import SuperTokens from 'supertokens-node/lib/build/supertokens'

export const middleware = () => {
  return async (c: Context, next: Next) => {
    let supertokens: SuperTokens | undefined = undefined
    const request = new STHonoRequest(c)
    const response = new STHonoResponse(c)
    const userContext = makeDefaultUserContextFromAPI(request)

    try {
      supertokens = SuperTokens.getInstanceOrThrowError();
      const result = await supertokens.middleware(request, response, userContext)
      if (!result) {
        await next()
      }
      return c.res
    } catch (err) {
      if (supertokens) {
        try {
          await supertokens.errorHandler(err, request, response, userContext)
        } catch (err) {
          throw err
        }
      } else {
        throw err
      }
    }
  }
}
