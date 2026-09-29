import type { CategoryId } from '../schedule/types'

// 種類ごとの自作アイコン（24×24、currentColor で塗る）
const svg = (body: string) =>
  `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`

const flame =
  '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.1 0-3.2 2.3-5.2 3.6-7.4.3 1.6 1 2.6 2 3.2C11.3 7.4 12.6 4.6 15 3c-.3 2.6.6 4.4 1.9 6.1 1 1.4 1.6 3 1.6 4.8 0 4.3-2.6 7.1-6.5 7.1Z"/>'

export const ICONS: Record<CategoryId, string> = {
  // 炎
  burnable: svg(flame),
  // 炎に斜線
  nonBurnable: svg(
    '<g transform="translate(3.6 3.6) scale(.7)">' +
      flame +
      '</g><circle cx="12" cy="12" r="10"/><path d="M5 5l14 14"/>',
  ),
  // 循環する矢印に囲まれた容器
  plastic: svg(
    '<path d="M8.5 9h7l-.8 7.5h-5.4Z"/><path d="M8 9h8"/>' +
      '<path d="M4 12a8 8 0 0 1 13.7-5.6"/><path d="M18 3.5v3h-3"/>' +
      '<path d="M20 12a8 8 0 0 1-13.7 5.6"/><path d="M6 20.5v-3h3"/>',
  ),
  // 缶とびん
  cansBottles: svg(
    '<rect x="3" y="9" width="7" height="12" rx="1.2"/><path d="M3 12h7M3 18h7"/>' +
      '<path d="M16 3h3v3.5c1.5 1 2 2.2 2 3.5V20a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-10c0-1.3.5-2.5 2-3.5Z"/>',
  ),
  // 新聞と段ボール
  paperClothes: svg(
    '<path d="M4 5h12v14H6a2 2 0 0 1-2-2Z"/><path d="M16 9h4v8a2 2 0 0 1-2 2h-2"/>' +
      '<path d="M7 8h6M7 11h6M7 14h3"/>',
  ),
  // 電池と稲妻
  metal: svg(
    '<rect x="6" y="5" width="12" height="16" rx="1.5"/><path d="M10 2.5h4V5h-4Z"/>' +
      '<path d="M13 8.5l-3 4.5h4l-3 4.5"/>',
  ),
}
