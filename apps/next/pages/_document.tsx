import NextDocument, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import { AppRegistry, StyleSheet } from 'react-native'

import Tamagui from '../tamagui.config'

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    AppRegistry.registerComponent('Main', () => Main)
    const page = await ctx.renderPage()

    // @ts-ignore RN doesn't have this type
    const rnwStyle = StyleSheet.getSheet()

    return {
      ...page,
      styles: (
        <>
          <style id={rnwStyle.id} dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }} />
          <style
            key='tamagui-css'
            dangerouslySetInnerHTML={{
              __html: Tamagui.getCSS({
                exclude: process.env.NODE_ENV === 'production' ? 'design-system' : null,
              }),
            }}
          />
        </>
      ),
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
