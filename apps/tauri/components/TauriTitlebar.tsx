import { appWindow } from '@tauri-apps/api/window'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const TauriTitlebar = () => {
  const [title, setTitle] = useState('')

  useEffect(() => {
    const getTitle = async () => {
      const title = await appWindow.title()
      setTitle(title)
    }
    getTitle()
  }, [])

  return (
    <div data-tauri-drag-region className="titlebar">
      <div data-tauri-drag-region className="titlebar-title">
        {title}
      </div>
      <div className="titlebar-nav">
        <div className="titlebar-button" id="titlebar-back" onClick={() => window.history.back()}>
          <Image src="https://api.iconify.design/mdi:arrow-left.svg" alt="back" />
        </div>
        <div
          className="titlebar-button"
          id="titlebar-forward"
          onClick={() => {
            window.history.forward()
          }}
        >
          <Image src="https://api.iconify.design/mdi:arrow-right.svg" alt="forward" />
        </div>
      </div>
      <div className="titlebar-button" id="titlebar-minimize" onClick={() => appWindow.minimize()}>
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
  )
}

export default TauriTitlebar
