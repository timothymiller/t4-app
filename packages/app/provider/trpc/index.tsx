import { TRPCProvider as TRPCProviderOG } from '../../utils/trpc'

export function TRPCProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  return <TRPCProviderOG>{children}</TRPCProviderOG>
}
