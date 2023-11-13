import { MMKV } from 'react-native-mmkv'

const cookieStorage = new MMKV()

export class CookieHandler {
  private storageId = 'supertokens-cookie-handler'

  private getData(): Record<string, string> {
    const stringifiedJSON = cookieStorage.getString(this.storageId)
    return JSON.parse(stringifiedJSON || '{}')
  }

  private setData(data: Record<string, string>) {
    cookieStorage.set(this.storageId, JSON.stringify(data))
  }

  private async setItem(key: string, value: string): Promise<void> {
    const data = this.getData()
    data[key] = value
    return this.setData(data)
  }

  async setCookie(cookieString: string): Promise<void> {
    const [nameValue = '', ...options] = cookieString.split(';')
    const [name, value] = nameValue.split('=').map((str) => str.trim())
    if (!name) return
    const optionsString = options.join(';')
    this.setItem(name, `${name}=${value};${optionsString}`)
  }

  async getCookie(): Promise<string> {
    const data = this.getData()

    const activeCookies = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => {
        const expiresMatch = value.match(/expires=([^;]*)/)
        if (expiresMatch) {
          const expiresString = expiresMatch[1]!
          return new Date(expiresString).getTime() > Date.now()
        }
        return true
      })
    )

    this.setData(activeCookies)

    const cookieString = Object.values(activeCookies).join('; ')
    return cookieString
  }
}
