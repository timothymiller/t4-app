import { SSRTestScreen } from './screen'

export const runtime = 'edge'

export default function Page() {
  const content = 'This page is rendered on the edge. It is not statically rendered.'
  return <SSRTestScreen content={content}></SSRTestScreen>
}
