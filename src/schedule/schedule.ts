import { CATEGORIES } from './categories'
import { EXCEPTIONS } from './exceptions'
import { RULES_E } from './rules-e'
import type { CalendarDate, CategoryId, CollectionItem, CollectionResult } from './types'

export const toKey = ({ y, m, d }: CalendarDate): string =>
  `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`

/** 0=日 … 6=土。ローカル時刻で計算し、タイムゾーンの影響を受けない */
export const weekdayOf = ({ y, m, d }: CalendarDate): number => new Date(y, m - 1, d).getDay()

/** その月の第n曜日（1〜5）。例外で収集がない日も回数に数える */
export const weekOfMonth = ({ d }: CalendarDate): number => Math.ceil(d / 7)

const categoryOrder = (id: CategoryId): number => CATEGORIES.findIndex((c) => c.id === id)

export const getCollection = (date: CalendarDate): CollectionResult => {
  const key = toKey(date)
  const yearData = EXCEPTIONS.find((e) => e.year === date.y)

  if (yearData?.noCollection.includes(key)) return { items: [], estimated: false }

  const weekday = weekdayOf(date)
  const week = weekOfMonth(date)
  const categories = new Set<CategoryId>(
    RULES_E.filter((r) => r.weekday === weekday && (!r.weeks || r.weeks.includes(week))).map(
      (r) => r.category,
    ),
  )

  const special = new Set(yearData?.special.find((s) => s.date === key)?.categories ?? [])
  for (const c of special) categories.add(c)

  const items: CollectionItem[] = [...categories]
    .sort((a, b) => categoryOrder(a) - categoryOrder(b))
    .map((category) => (special.has(category) ? { category, special: true } : { category }))

  return { items, estimated: !yearData }
}
