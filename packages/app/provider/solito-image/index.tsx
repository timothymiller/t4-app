import { replaceLocalhost } from 'app/utils/trpc/localhost.native'
import { SolitoImageProvider as SolitoImageProviderOG } from 'solito/image'

export const getImageUrl = () => {
  const imageUrl = `${process.env.EXPO_PUBLIC_APP_URL}`
  return replaceLocalhost(imageUrl)
}

export const SolitoImageProvider = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  return (
    <SolitoImageProviderOG nextJsURL={getImageUrl() as `http:${string}` | `https:${string}`}>
      {children}
    </SolitoImageProviderOG>
  )
}
