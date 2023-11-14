import { MMKV } from 'react-native-mmkv'

const localStorage = new MMKV()
export class StorageHandler {
  async key(index: number): Promise<string | null> {
    throw new Error(`key is not implemented`)
  }

  async getItem(key: string): Promise<string | null> {
    return localStorage.getString(key) || null
  }

  async clear(): Promise<void> {
    localStorage.clearAll()
  }

  async removeItem(key: string): Promise<void> {
    localStorage.delete(key)
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.set(key, value)
  }

  keySync(index: number): string | null {
    throw new Error(`keySync is not implemented`)
  }

  getItemSync(key: string): string | null {
    return localStorage.getString(key) || null
  }

  clearSync(): void {
    localStorage.clearAll()
  }

  removeItemSync(key: string): void {
    localStorage.delete(key)
  }

  setItemSync(key: string, value: string): void {
    localStorage.set(key, value)
  }
}
