import { env } from "./env.mjs"

// Docs: https://developers.cloudflare.com/images/url-format
export default function cloudflareLoader ({ src, width, quality }) {
  const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto']
  // const params = [`width=${width}`, `quality=${quality || 75}`]
  const isDev = process.env.NODE_ENV === 'development'
  const appUrl = env.NEXT_PUBLIC_APP_URL
  
  if (isDev) {
    return `${appUrl}/${src}`
  } else {
    return `${appUrl}/cdn-cgi/image/${params.join(',')}${src}`
  }
}
