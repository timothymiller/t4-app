import NextDocument, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import { Children } from 'react'
import { AppRegistry } from 'react-native'
import Image from 'next/image'
import { appWindow } from '@tauri-apps/api/window'

import Tamagui from '../tamagui.config'
import dynamic from 'next/dynamic'

const TauriTitlebar = dynamic(() => import('components/TauriTitlebar'), {
  ssr: false,
})

export default class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    AppRegistry.registerComponent('Main', () => Main)
    const page = await ctx.renderPage()

    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication('Main')

    /**
     * Note: be sure to keep tamagui styles after react-native-web styles like it is here!
     * So Tamagui styles can override the react-native-web styles.
     */
    const styles = [
      getStyleElement(),
      <style
        key="tamagui-css"
        dangerouslySetInnerHTML={{
          __html: Tamagui.getCSS({
            exclude: process.env.NODE_ENV === 'development' ? null : 'design-system',
          }),
        }}
      />,
    ]

    return { ...page, styles: Children.toArray(styles) }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        </Head>
        <body>
          <div data-tauri-drag-region className="titlebar">
            <div
              className="titlebar-button"
              id="titlebar-minimize"
              onClick={() => appWindow.minimize()}
            >
              <Image src="https://api.iconify.design/mdi:window-minimize.svg" alt="minimize" />
            </div>
            <div
              className="titlebar-button"
              id="titlebar-maximize"
              onClick={() => appWindow.toggleMaximize()}
            >
              <Image src="https://api.iconify.design/mdi:window-maximize.svg" alt="maximize" />
            </div>
            <div className="titlebar-button" id="titlebar-close" onClick={() => appWindow.close()}>
              <Image src="https://api.iconify.design/mdi:close.svg" alt="close" />
            </div>
          </div>
          <TauriTitlebar />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
