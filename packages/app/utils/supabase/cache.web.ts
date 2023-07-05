import Cookies from 'js-cookie'

export async function saveToken(key: string, value: string) {
  await Cookies.set(key, value)
}

export async function getToken(key: string) {
  const value = await Cookies.get(key)
  return value
}
