type LockState = { isLocked: boolean; waitingPromises: Array<(value: boolean) => void> }
class Lock {
  private lockStateMap: Record<string, LockState> = {}

  private getOrCreateLockState(key: string) {
    if (!this.lockStateMap[key]) {
      this.lockStateMap[key] = {
        isLocked: false,
        waitingPromises: [],
      }
    }
    // biome-ignore lint/style/noNonNullAssertion: ts isn't smart enough to infer that it can't be undefined
    return this.lockStateMap[key]!
  }

  async acquireLock(key: string, timeout: number): Promise<boolean> {
    const lockState = this.getOrCreateLockState(key)

    if (!lockState.isLocked) {
      lockState.isLocked = true
      return true
    } else {
      return new Promise<boolean>((resolve) => {
        lockState.waitingPromises.push(resolve)
        setTimeout(() => resolve(false), timeout)
      })
    }
  }

  async releaseLock(key: string): Promise<void> {
    const lockState = this.getOrCreateLockState(key)

    if (lockState.isLocked) {
      lockState.isLocked = false

      const nextLockPromise = lockState.waitingPromises.shift()
      if (nextLockPromise) {
        lockState.isLocked = true
        nextLockPromise(true)
      }
    }
  }
}

export async function LockFactory(): Promise<Lock> {
  return new Lock()
}
