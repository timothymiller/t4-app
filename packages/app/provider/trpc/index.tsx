import { TRPCProvider as TRPCProviderOG } from '../../utils/trpc'

export const TRPCProvider = ({ children }: { children: React.ReactNode }): React.ReactNode => {
  return <TRPCProviderOG>{children}</TRPCProviderOG>
}
