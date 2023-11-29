import { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import {
  CollectingResponse,
  PreParsedRequest,
  middleware as customMiddleware,
} from 'supertokens-node/framework/custom'
import Session from 'supertokens-node/recipe/session'
import { HTTPMethod } from 'supertokens-node/types'
import { serialize } from 'cookie'

function setCookiesInHeaders(headers: Headers, cookies: CollectingResponse['cookies']) {
  for (const cookie of cookies) {
    headers.append(
      'Set-Cookie',
      serialize(cookie.key, cookie.value, {
        domain: cookie.domain,
        expires: new Date(cookie.expires),
        httpOnly: cookie.httpOnly,
        path: cookie.path,
        sameSite: cookie.sameSite,
        secure: cookie.secure,
      })
    )
  }
}

export const middleware = () => {
  return async function (c: Context, next: Next) {
    const request = new PreParsedRequest({
      method: c.req.method as HTTPMethod,
      url: c.req.url,
      query: Object.fromEntries(new URL(c.req.url).searchParams.entries()),
      cookies: getCookie(c),
      headers: c.req.raw.headers as Headers,
      getFormBody: () => c.req.formData(),
      getJSONBody: () => c.req.json(),
    })
    const baseResponse = new CollectingResponse()

    const stMiddleware = customMiddleware<Context>((c) => request)

    const { handled, error } = await stMiddleware(c, baseResponse)

    if (error) {
      throw error
    }

    if (handled) {
      setCookiesInHeaders(baseResponse.headers, baseResponse.cookies)
      return new Response(baseResponse.body, {
        status: baseResponse.statusCode,
        headers: baseResponse.headers,
      })
    }

    // Add session to c.req if it exists
    try {
      c.req.session = await Session.getSession(request, baseResponse, {
        sessionRequired: false,
      })

      await next()

      // Add cookies that were set set by `getSession` to response before returning
      setCookiesInHeaders(c.res.headers, baseResponse.cookies)
      return c.res
    } catch (err) {
      if (Session.Error.isErrorFromSuperTokens(err)) {
        if (
          err.type === Session.Error.TRY_REFRESH_TOKEN ||
          err.type === Session.Error.INVALID_CLAIMS
        ) {
          return new Response('Unauthorized', {
            status: err.type === Session.Error.INVALID_CLAIMS ? 403 : 401,
          })
        }
      }
    }
  }
}
