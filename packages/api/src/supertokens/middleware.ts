import { Context, Next } from 'hono'
import { STHonoRequest, STHonoResponse } from './hono'
import { middleware as customMiddleware, PreParsedRequest } from 'supertokens-node/framework/custom'
import { HTTPMethod } from 'supertokens-node/types'
import Session from 'supertokens-node/recipe/session'
import { getCookie } from 'hono/cookie'

export const middleware = () => {
  return async function (c: Context, next: Next) {
    const stMiddleware = customMiddleware<Context>((c) => {
      const query = Object.fromEntries(new URL(c.req.url).searchParams.entries())

      return new PreParsedRequest({
        method: c.req.method as HTTPMethod,
        url: c.req.url,
        query,
        cookies: getCookie(c),
        headers: c.req.raw.headers as Headers,
        getFormBody: () => c.req.formData(),
        getJSONBody: () => c.req.json(),
      })
    })

    const response = new STHonoResponse(c)
    const { handled, error } = await stMiddleware(c, response)

    if (handled) {
      return c.res
    }

    if (error) {
      throw error
    }

    // Add session to c.req if it exists
    try {
      c.req.session = await Session.getSession(new STHonoRequest(c), response, {
        sessionRequired: false,
      })
      return await next()
    } catch (err) {
      console.log('err', err)
      if (Session.Error.isErrorFromSuperTokens(err)) {
        if (
          err.type === Session.Error.TRY_REFRESH_TOKEN ||
          err.type === Session.Error.INVALID_CLAIMS
        ) {
          return new Response('Authentication required', {
            status: err.type === Session.Error.INVALID_CLAIMS ? 403 : 401,
          })
        }
      }
    }
    await next()
  }
}
