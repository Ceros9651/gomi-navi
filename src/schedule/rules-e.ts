import type { Rule } from './types'

// 春日井市 E地区 資源・ごみ出しカレンダーの凡例
export const RULES_E: readonly Rule[] = [
  { category: 'burnable', weekday: 2 }, // 火曜
  { category: 'burnable', weekday: 5 }, // 金曜
  { category: 'nonBurnable', weekday: 4, weeks: [1, 3] }, // 第1・第3木曜
  { category: 'plastic', weekday: 4 }, // 木曜
  { category: 'cansBottles', weekday: 1, weeks: [2, 4] }, // 第2・第4月曜
  { category: 'paperClothes', weekday: 1, weeks: [1, 3] }, // 第1・第3月曜
  { category: 'metal', weekday: 6, weeks: [3] }, // 第3土曜
]
