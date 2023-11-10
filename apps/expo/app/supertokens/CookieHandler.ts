import { MMKVLoader } from 'react-native-mmkv-storage'

const cookieStorage = new MMKVLoader().withEncryption().withInstanceID('cookie').initialize()

export class CookieHandler {
  private storageId = 'supertokens-cookie-handler'

  private getData() {
    return (cookieStorage.getMap(this.storageId) ?? {}) as Record<string, unknown>
  }

  private setData(data: Record<string, unknown>) {
    cookieStorage.setMap(this.storageId, data)
  }

  private async setItem(key: string, value: string): Promise<void> {
    const data = this.getData()
    data[key] = value
    return this.setData(data)
  }

  private async deleteItem(key: string): Promise<void> {
    const data = this.getData()
    if (!data) return
    delete data[key]
    return this.setData(data)
  }

  private isCookieExpired(expires: Date): boolean {
    return expires.getTime() <= Date.now()
  }

  async setCookie(cookieString: string): Promise<void> {
    const [nameValue = '', ...options] = cookieString.split(';')
    const [name, value] = nameValue.split('=').map((str) => str.trim())
    if (!name) return
    const optionsString = options.join(';')
    const expiresMatch = optionsString.match(/expires=([^;]*)/)
    if (expiresMatch) {
      const expiresString = expiresMatch[1]!
      const expires = new Date(expiresString)
      if (this.isCookieExpired(expires)) {
        this.deleteItem(name)
        return
      }
    }
    this.setItem(name, `${name}=${value};${optionsString}`)
  }

  async getCookie(): Promise<string> {
    const data = this.getData()
    const cookieString = Object.values(data).join('; ')
    return cookieString
  }
}
