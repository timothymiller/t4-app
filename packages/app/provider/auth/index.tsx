export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Do we have to insert something here?
  // The authorization token is already passed when creating the trpc client in /utils/trpc/index.tsx

  return <>{children}</>
}
