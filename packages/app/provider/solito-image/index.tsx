import { SolitoImageProvider as SolitoImageProviderOG } from 'solito/image'

const imageURL = process.env.NEXT_PUBLIC_APP_URL

export const SolitoImageProvider = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode => {
  return <SolitoImageProviderOG nextJsURL={imageURL as `http:${string}` | `https:${string}`}>{children}</SolitoImageProviderOG>
}
