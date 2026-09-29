import { describe, expect, it } from 'vitest'
import { getViewState } from './clock'

describe('getViewState', () => {
  it('7:59 は締め切り前で、次の境界は今日の8:00', () => {
    const s = getViewState(new Date(2026, 8, 29, 7, 59, 59))
    expect(s.today).toEqual({ y: 2026, m: 9, d: 29 })
    expect(s.tomorrow).toEqual({ y: 2026, m: 9, d: 30 })
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
    expect(s.today).toEqual({ y: 2026, m: 9, d: 30 })
    expect(s.todayClosed).toBe(false)
  })

  it('月末の明日は翌月1日', () => {
    expect(getViewState(new Date(2026, 8, 30, 12)).tomorrow).toEqual({ y: 2026, m: 10, d: 1 })
  })

  it('年末の明日は翌年1月1日、次の境界も翌年', () => {
    const s = getViewState(new Date(2026, 11, 31, 23, 0))
    expect(s.tomorrow).toEqual({ y: 2027, m: 1, d: 1 })
    expect(s.nextBoundary).toEqual(new Date(2027, 0, 1))
  })
})
