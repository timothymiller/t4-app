// on Web, we don't need to use this, we are using the next middleware
// instead, we just have a no-op here
// for more, see: https://solito.dev/recipes/tree-shaking

export const TRPCProvider = ({ children }: { children: React.ReactElement }) => <>{children}</>
