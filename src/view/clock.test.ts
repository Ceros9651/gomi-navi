import { describe, expect, it } from 'vitest'
import { getViewState } from './clock'

describe('getViewState', () => {
  it('7:59 は締め切り前で、次の境界は今日の8:00', () => {
    const s = getViewState(new Date(2026, 8, 29, 7, 59, 59))
    expect(s.days[0]).toEqual({ y: 2026, m: 9, d: 29 })
    expect(s.days[1]).toEqual({ y: 2026, m: 9, d: 30 })
    expect(s.todayClosed).toBe(false)
    expect(s.nextBoundary).toEqual(new Date(2026, 8, 29, 8))
  })

  it('8:00 ちょうどは締め切り済みで、次の境界は翌日0:00', () => {
    const s = getViewState(new Date(2026, 8, 29, 8, 0, 0))
    expect(s.todayClosed).toBe(true)
    expect(s.nextBoundary).toEqual(new Date(2026, 8, 30))
  })

  it('0:00 は新しい日の締め切り前', () => {
    const s = getViewState(new Date(2026, 8, 30, 0, 0, 0))
    expect(s.days[0]).toEqual({ y: 2026, m: 9, d: 30 })
    expect(s.todayClosed).toBe(false)
  })

  it('今日から6日後までの7日分を日付順に返す', () => {
    expect(getViewState(new Date(2026, 8, 29, 10)).days).toEqual([
      { y: 2026, m: 9, d: 29 },
      { y: 2026, m: 9, d: 30 },
      { y: 2026, m: 10, d: 1 },
      { y: 2026, m: 10, d: 2 },
      { y: 2026, m: 10, d: 3 },
      { y: 2026, m: 10, d: 4 },
      { y: 2026, m: 10, d: 5 },
    ])
  })

  it('月末は明日が翌月1日で、最後は6日後', () => {
    const { days } = getViewState(new Date(2026, 8, 30, 12))
    expect(days[1]).toEqual({ y: 2026, m: 10, d: 1 })
    expect(days[6]).toEqual({ y: 2026, m: 10, d: 6 })
  })

  it('年末は翌年にまたがる', () => {
    const { days } = getViewState(new Date(2026, 11, 28, 10))
    expect(days[0]).toEqual({ y: 2026, m: 12, d: 28 })
    expect(days[4]).toEqual({ y: 2027, m: 1, d: 1 })
    expect(days[6]).toEqual({ y: 2027, m: 1, d: 3 })
  })

  it('大晦日の次の境界は翌年', () => {
    const s = getViewState(new Date(2026, 11, 31, 23, 0))
    expect(s.days[1]).toEqual({ y: 2027, m: 1, d: 1 })
    expect(s.nextBoundary).toEqual(new Date(2027, 0, 1))
  })
})
