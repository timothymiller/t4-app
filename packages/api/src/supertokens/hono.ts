import { Context as HonoContext } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import type { HTTPMethod } from 'supertokens-node/types'


export class STHonoRequest {
  wrapperUsed: boolean;
  original: any;
  private context: HonoContext

  constructor(context: HonoContext) {
    this.wrapperUsed = true;
    this.context = context
  }

  getFormData = async (): Promise<any> => {
    this.context.req.formData()
  }

  getKeyValueFromQuery = (key: string): string | undefined => {
    return this.context.req.query(key)
  }

  getJSONBody = async (): Promise<any> => {
    return this.context.req.json()
  }

  getMethod = (): HTTPMethod => {
    return this.context.req.method as HTTPMethod
  }

  getCookieValue = (key: string): string | undefined => {
    return getCookie(this.context)[key]
  }

  getHeaderValue = (key: string): string | undefined => {
    return this.context.req.header(key)
  }

  getOriginalURL = (): string => {
    return this.context.req.url
  }
}

// Note that SuperTokens' BaseResponse class requires returning a response to the client after using the sendJSONResponse or sendHTMLResponse methods. 
// However, Hono's Context methods json and html yield a Response object that must be explicitly returned by the middleware or route handler.
// To address this, we substitute context.res with the Response object returned by the json or html methods, and subsequently manually return the context.res object when necessary.
export class STHonoResponse {
  wrapperUsed: boolean;
  original: any;
  private context: HonoContext

  constructor(context: HonoContext) {
    this.wrapperUsed = true;
    this.context = context
  }

  setHeader = (key: string, value: string, allowDuplicateKey: boolean) => {
    // TODO: Figure out how to handle allowDuplicateKey
    this.context.header(key, value)
  }

  removeHeader = (key: string) => {
    this.context.header(key, undefined)
  }

  setCookie = (
    key: string,
    value: string,
    domain: string | undefined,
    secure: boolean,
    httpOnly: boolean,
    expires: number,
    path: string,
    sameSite: 'strict' | 'lax' | 'none'
  ) => {
    const sameSiteInUppercase = {
      strict: 'Strict',
      lax: 'Lax',
      none: 'None',
    }[sameSite] as 'Strict' | 'Lax' | 'None'

    setCookie(this.context, key, value, {
      domain,
      expires: new Date(expires),
      httpOnly,
      path,
      sameSite: sameSiteInUppercase,
      secure,
    })
  }

  setStatusCode = (statusCode: number) => {
    this.context.status(statusCode)
  }

  sendJSONResponse = (content: any) => {
    this.context.res = this.context.json(content)
  }

  sendHTMLResponse = async (html: string) => {
    this.context.res = await this.context.html(html)
  }

}
