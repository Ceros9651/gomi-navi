import type { YearExceptions } from './types'

// 年版カレンダーの例外日。新しい年版のPDFが出たら1ブロック追加する（README参照）
// この一覧にある年は「確定」、ない年は曜日ルールからの「推定」として扱う
export const EXCEPTIONS: readonly YearExceptions[] = [
  {
    // 2026年版 E地区カレンダー
    year: 2026,
    noCollection: ['2026-01-01', '2026-01-02', '2026-12-30', '2026-12-31'],
    special: [{ date: '2026-12-29', categories: ['burnable'] }],
  },
]
