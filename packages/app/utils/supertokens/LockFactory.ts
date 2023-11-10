class Lock {
  private locks: Record<string, boolean> = {};

  async acquireLock(key: string, timeout: number): Promise<boolean> {
    if (!this.locks[key]) {
      this.locks[key] = true
      return true
    } else {
      const startTime = Date.now()
      while (Date.now() - startTime < timeout) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        if (!this.locks[key]) {
          this.locks[key] = true
          return true
        }
      }
      return false
    }
  }

  async releaseLock(key: string): Promise<void> {
    console.log('releaseLock called', key)
    if (this.locks[key]) {
      delete this.locks[key]
    }
  }
}

export async function LockFactory(): Promise<Lock> {
  return new Lock();
}
