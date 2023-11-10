import { MMKVLoader } from 'react-native-mmkv-storage'

const localStorage = new MMKVLoader().withEncryption().withInstanceID('localStorage').initialize();

export class StorageHandler {
  async key(index: number): Promise<string | null> {
    throw new Error(`key is not implemented`);
  }

  async getItem(key: string): Promise<string | null> {
    return localStorage.getString(key);
  }

  async clear(): Promise<void> {
    localStorage.clearStore();
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setString(key, value);
  }

  keySync(index: number): string | null {
    throw new Error(`keySync is not implemented`);
  }

  getItemSync(key: string): string | null {
    return localStorage.getString(key);
  }

  clearSync(): void {
    localStorage.clearStore();
  }

  removeItemSync(key: string): void {
    localStorage.removeItem(key);
  }

  setItemSync(key: string, value: string): void {
    localStorage.setString(key, value);
  }
}
