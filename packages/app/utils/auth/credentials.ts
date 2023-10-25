import { storage } from 'app/provider/kv'

export async function storeSessionToken(id: string | null | undefined) {
  if (id) {
    storage.set('auth_session', id)
  } else {
    storage.delete('auth_session')
  }
}

export function getSessionToken() {
  return storage.getString('auth_session')
}
