/** ごみの種類 */
export type CategoryId =
  | 'burnable' // 燃やせるごみ
  | 'nonBurnable' // 燃やせないごみ
  | 'plastic' // プラスチック製容器包装
  | 'cansBottles' // 飲料缶、ガラスびん、ペットボトル
  | 'paperClothes' // 新聞紙、雑誌・雑がみ、段ボール、牛乳パック類、古着
  | 'metal' // 金属類（小型家電、電池類、発火性危険物を含む）

export interface Category {
  id: CategoryId
  name: string
  /** 品目例（春日井市の公式情報に記載のもの） */
  examples: string[]
}

/** 暦日（端末のローカル日付。月は1〜12） */
export interface CalendarDate {
  y: number
  m: number
  d: number
}

/** 収集ルール。weeks を省略すると毎週 */
export interface Rule {
  category: CategoryId
  /** 0=日 … 6=土 */
  weekday: number
  /** 第n週（1〜5）。省略時は毎週 */
  weeks?: number[]
}

/** 年版カレンダーの例外日 */
export interface YearExceptions {
  year: number
  /** 収集なしの日（YYYY-MM-DD） */
  noCollection: string[]
  /** 特別収集の日 */
  special: { date: string; categories: CategoryId[] }[]
}

export interface CollectionItem {
  category: CategoryId
  special?: boolean
}

export interface CollectionResult {
  items: CollectionItem[]
  /** 年版データの範囲外で、曜日ルールだけから推定した結果 */
  estimated: boolean
}
