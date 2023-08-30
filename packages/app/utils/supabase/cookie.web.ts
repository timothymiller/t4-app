export function getCookieValue(cookieName: string): string | undefined {
  const cookieString = document.cookie
  const cookieNameLength = cookieName.length
  const cookies = cookieString.split(';')

  for (let i = 0, len = cookies.length; i < len; i++) {
    let cookie = cookies[i]
    if (cookie?.length === 0) continue

    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1)
    }

    if (cookie.indexOf(cookieName) === 0) {
      const cookieValue = cookie.substring(cookieNameLength + 1)
      return decodeURIComponent(cookieValue)
    }
  }

  return undefined
}
