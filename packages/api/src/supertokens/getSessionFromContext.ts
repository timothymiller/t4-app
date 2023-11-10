import { Context } from 'hono'
import { VerifySessionOptions, getSession } from 'supertokens-node/recipe/session'
import { makeDefaultUserContextFromAPI } from 'supertokens-node/lib/build/utils'
import { STHonoRequest, STHonoResponse } from './hono'

export default async function getSessionFromContext(
  context: Context,
  options: VerifySessionOptions
) {
  const request = new STHonoRequest(context)

  const response = new STHonoResponse(context)
  const userContext = makeDefaultUserContextFromAPI(request)

  try {
    const session = await getSession(request, response, options, userContext)
    return session
  } catch (err) {
    console.log('Got an error while verifying session: ', err)
    return undefined
  }
}
