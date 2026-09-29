import { describe, expect, it } from 'vitest'
import { CATEGORIES } from './categories'
import { CALENDAR_2026_E } from './fixtures/calendar-2026-e'
import { getCollection } from './schedule'
import type { CalendarDate } from './types'

const date = (key: string): CalendarDate => {
  const [y, m, d] = key.split('-').map(Number)
  return { y, m, d }
}
const categoriesOf = (key: string) => getCollection(date(key)).items.map((i) => i.category)

describe('ごみの種類', () => {
  it('6種類すべてに表示名と1つ以上の品目例がある', () => {
    expect(CATEGORIES.map((c) => c.id)).toEqual([
      'burnable',
      'nonBurnable',
      'plastic',
      'cansBottles',
      'paperClothes',
      'metal',
    ])
    for (const c of CATEGORIES) {
      expect(c.name).not.toBe('')
      expect(c.examples.length).toBeGreaterThan(0)
    }
  })
})

describe('曜日ルール', () => {
  it('燃やせるごみの日', () => {
    expect(categoriesOf('2026-09-29')).toEqual(['burnable'])
  })
  it('同じ日に複数の種類', () => {
    expect(categoriesOf('2026-10-15')).toEqual(['nonBurnable', 'plastic'])
  })
  it('収集のない日', () => {
    expect(categoriesOf('2026-09-30')).toEqual([])
  })
  it('祝日も通常どおり', () => {
    expect(categoriesOf('2026-11-03')).toEqual(['burnable'])
  })
  it('例外日も第n曜日の回数に数える', () => {
    expect(categoriesOf('2026-01-15')).toEqual(['nonBurnable', 'plastic'])
  })
})

describe('年版ごとの例外日', () => {
  it('年始の収集なし', () => {
    expect(categoriesOf('2026-01-01')).toEqual([])
    expect(categoriesOf('2026-01-02')).toEqual([])
  })
  it('年末の収集なし', () => {
    expect(categoriesOf('2026-12-31')).toEqual([])
  })
  it('特別収集', () => {
    expect(getCollection(date('2026-12-29')).items).toEqual([{ category: 'burnable', special: true }])
  })
})

describe('2026年版カレンダーとの一致', () => {
  it('期待値は365日分ある', () => {
    expect(CALENDAR_2026_E.size).toBe(365)
  })
  it.each([...CALENDAR_2026_E])('%s', (key, expected) => {
    expect(new Set(categoriesOf(key))).toEqual(new Set(expected))
  })
})

describe('対象年外の推定', () => {
  it('範囲外の日付は推定', () => {
    const r = getCollection(date('2027-01-05'))
    expect(r.items.map((i) => i.category)).toEqual(['burnable'])
    expect(r.estimated).toBe(true)
  })
  it('範囲内の日付は推定ではない', () => {
    expect(getCollection(date('2026-12-29')).estimated).toBe(false)
  })
})
