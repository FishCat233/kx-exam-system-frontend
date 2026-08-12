import screenfull from 'screenfull'

export async function requestFullscreenMode(): Promise<void> {
  if (screenfull.isEnabled) {
    await screenfull.request(document.documentElement)
    return
  }

  if (document.documentElement.requestFullscreen) {
    await document.documentElement.requestFullscreen()
    return
  }

  throw new Error('当前浏览器不支持全屏模式')
}

export async function exitFullscreenMode(): Promise<void> {
  if (screenfull.isEnabled && screenfull.isFullscreen) {
    await screenfull.exit()
  } else if (document.fullscreenElement) {
    await document.exitFullscreen()
  }
}
