import { TRPCProvider as TRPCProviderOG } from '../../utils/trpc/index.web'

export const TRPCProvider = ({ children }: { children: React.ReactNode }): React.ReactNode => {
  return <TRPCProviderOG>{children}</TRPCProviderOG>
}

// This used to be a no-op with the Pages router, but TRPCNext does not work
// with App router so we have to provider our own trpc client and provider
// export const TRPCProvider = ({ children }: { children: React.ReactNode }): React.ReactNode => (
//   <>{children}</>
// )
