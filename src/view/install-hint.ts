const STORAGE_KEY = 'gomi-navi:install-hint-dismissed'

export interface HintEnv {
  /** ホーム画面から起動しているか */
  standalone: boolean
  /** iPhone / iPad か */
  ios: boolean
  /** 案内を閉じたことがあるか */
  dismissed: boolean
}

export const shouldShowHint = ({ standalone, ios, dismissed }: HintEnv): boolean =>
  ios && !standalone && !dismissed

const isStandalone = (): boolean =>
  (navigator as Navigator & { standalone?: boolean }).standalone === true ||
  matchMedia('(display-mode: standalone)').matches

// iPadOS は Mac として名乗るので、タッチ対応かどうかで見分ける
const isIos = (): boolean =>
  /iPhone|iPad|iPod/.test(navigator.userAgent) ||
  (navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1)

// 読み書きに失敗しても案内がもう一度出るだけなので、例外は握りつぶす
const readDismissed = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

const writeDismissed = () => {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // 保存できなくても閉じる操作は続ける
  }
}

export const setupInstallHint = (root: HTMLElement) => {
  if (!shouldShowHint({ standalone: isStandalone(), ios: isIos(), dismissed: readDismissed() })) return

  root.innerHTML = `
    <aside class="install-hint" role="note">
      <p>ホーム画面に追加すると、アプリのようにすぐ開けます。<br />
        Safariの <strong>共有ボタン</strong> →「<strong>ホーム画面に追加</strong>」</p>
      <button type="button" class="install-hint-close" aria-label="案内を閉じる">×</button>
    </aside>`
  root.querySelector('button')!.addEventListener('click', () => {
    writeDismissed()
    root.innerHTML = ''
  })
}
