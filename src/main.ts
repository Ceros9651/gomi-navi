import './style.css'
import { getViewState } from './view/clock'
import { setupInstallHint } from './view/install-hint'
import { render } from './view/render'

const root = document.querySelector<HTMLDivElement>('#app')!

// 開発時のみ ?now=2026-12-29T07:30 で現在日時を差し替えられる
const devNow = import.meta.env.DEV ? new URLSearchParams(location.search).get('now') : null
const now = () => (devNow ? new Date(devNow) : new Date())

let timer: number | undefined

const update = () => {
  const state = getViewState(now())
  render(root, state)
  // 次の境界（今日の8:00 または 翌日0:00）で再描画する。
  // iOSはバックグラウンドでタイマーを止めるので、復帰時は visibilitychange / pageshow で補う
  clearTimeout(timer)
  if (!devNow) timer = window.setTimeout(update, state.nextBoundary.getTime() - Date.now() + 1000)
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') update()
})
window.addEventListener('pageshow', update)

update()
setupInstallHint(document.querySelector<HTMLDivElement>('#install-hint')!)
