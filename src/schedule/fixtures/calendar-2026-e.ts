import type { CategoryId } from '../types'

// 2026年版 E地区 資源・ごみ出しカレンダー（PDF）を目で見て書き起こした期待値。
// ルールから生成してはいけない（ルールの誤りを検出するためのデータ）。
// https://www.city.kasugai.lg.jp/_res/projects/default_project/_page_/001/033/284/2026_E_A4size.pdf
//
// 記号: B=燃やせるごみ N=燃やせないごみ P=プラスチック製容器包装
//       R=飲料缶・ガラスびん・ペットボトル K=新聞紙・雑誌・段ボール・牛乳パック・古着 M=金属類
// 書かれていない日は収集なし
const MONTHS: Record<number, string> = {
  1: '5K 6B 8P 9B 12R 13B 15PN 16B 17M 19K 20B 22P 23B 26R 27B 29P 30B',
  2: '2K 3B 5PN 6B 9R 10B 12P 13B 16K 17B 19PN 20B 21M 23R 24B 26P 27B',
  3: '2K 3B 5PN 6B 9R 10B 12P 13B 16K 17B 19PN 20B 21M 23R 24B 26P 27B 31B',
  4: '2PN 3B 6K 7B 9P 10B 13R 14B 16PN 17B 18M 20K 21B 23P 24B 27R 28B 30P',
  5: '1B 4K 5B 7PN 8B 11R 12B 14P 15B 16M 18K 19B 21PN 22B 25R 26B 28P 29B',
  6: '1K 2B 4PN 5B 8R 9B 11P 12B 15K 16B 18PN 19B 20M 22R 23B 25P 26B 30B',
  7: '2PN 3B 6K 7B 9P 10B 13R 14B 16PN 17B 18M 20K 21B 23P 24B 27R 28B 30P 31B',
  8: '3K 4B 6PN 7B 10R 11B 13P 14B 15M 17K 18B 20PN 21B 24R 25B 27P 28B',
  9: '1B 3PN 4B 7K 8B 10P 11B 14R 15B 17PN 18B 19M 21K 22B 24P 25B 28R 29B',
  10: '1PN 2B 5K 6B 8P 9B 12R 13B 15PN 16B 17M 19K 20B 22P 23B 26R 27B 29P 30B',
  11: '2K 3B 5PN 6B 9R 10B 12P 13B 16K 17B 19PN 20B 21M 23R 24B 26P 27B',
  12: '1B 3PN 4B 7K 8B 10P 11B 14R 15B 17PN 18B 19M 21K 22B 24P 25B 28R 29B',
}

const CODES: Record<string, CategoryId> = {
  B: 'burnable',
  N: 'nonBurnable',
  P: 'plastic',
  R: 'cansBottles',
  K: 'paperClothes',
  M: 'metal',
}

/** YYYY-MM-DD → その日の種類（2026年の365日すべて。収集なしは空配列） */
export const CALENDAR_2026_E: ReadonlyMap<string, CategoryId[]> = (() => {
  const map = new Map<string, CategoryId[]>()
  for (let m = 1; m <= 12; m++) {
    const days = new Date(2026, m, 0).getDate()
    for (let d = 1; d <= days; d++) {
      map.set(`2026-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, [])
    }
    for (const token of MONTHS[m].split(' ')) {
      const [, day, codes] = token.match(/^(\d+)([A-Z]+)$/)!
      const key = `2026-${String(m).padStart(2, '0')}-${day.padStart(2, '0')}`
      if (!map.has(key)) throw new Error(`invalid date in fixture: ${key}`)
      map.set(key, [...codes].map((c) => CODES[c]))
    }
  }
  return map
})()
