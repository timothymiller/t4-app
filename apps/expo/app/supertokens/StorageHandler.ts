import { MMKVLoader } from 'react-native-mmkv-storage'

const localStorage = new MMKVLoader().withEncryption().withInstanceID('localStorage').initialize();

export class StorageHandler {
  async key(index: number): Promise<string | null> {
    throw new Error("Unsupported");
  }

  async getItem(key: string): Promise<string | null> {
    console.log('getItem called', key);
    return localStorage.getString(key);
  }

  async clear(): Promise<void> {
    throw new Error("Unsupported");
  }

  async removeItem(key: string): Promise<void> {
    console.log('removeItem called', key);
    localStorage.removeItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setString(key, value);
  }

  keySync(index: number): string | null {
    throw new Error("Unsupported");
  }

  getItemSync(key: string): string | null {
    console.log('getItemSync called', key);
    return localStorage.getString(key);
  }

  clearSync(): void {
    console.log('clearSync called');
    localStorage.clearStore();
  }

  removeItemSync(key: string): void {
    console.log('removeItemSync called', key);
    localStorage.removeItem(key);
  }

  setItemSync(key: string, value: string): void {
    console.log('setItemSync called', key, value);
    localStorage.setString(key, value);
  }
}
