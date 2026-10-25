import type { CalendarDate } from '../schedule/types'

/** 収集日当日の朝8時まで */
export const DEADLINE_HOUR = 8

/** 今日から6日後までの1週間分 */
export const DAYS_SHOWN = 7

export interface ViewState {
  /** 今日（days[0]）から6日後（days[6]）まで */
  days: CalendarDate[]
  /** 今日の締め切り（8:00）を過ぎているか */
  todayClosed: boolean
  /** 表示が変わる次の時刻（今日の8:00 または 翌日0:00） */
  nextBoundary: Date
}

const toCalendarDate = (d: Date): CalendarDate => ({
  y: d.getFullYear(),
  m: d.getMonth() + 1,
  d: d.getDate(),
})

export const getViewState = (now: Date): ViewState => {
  const y = now.getFullYear()
  const m = now.getMonth()
  const d = now.getDate()
  const deadline = new Date(y, m, d, DEADLINE_HOUR)
  const todayClosed = now >= deadline
  return {
    days: Array.from({ length: DAYS_SHOWN }, (_, i) => toCalendarDate(new Date(y, m, d + i))),
    todayClosed,
    nextBoundary: todayClosed ? new Date(y, m, d + 1) : deadline,
  }
}
