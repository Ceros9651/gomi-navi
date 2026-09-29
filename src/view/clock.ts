import type { CalendarDate } from '../schedule/types'

/** 収集日当日の朝8時まで */
export const DEADLINE_HOUR = 8

export interface ViewState {
  today: CalendarDate
  tomorrow: CalendarDate
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
    today: toCalendarDate(now),
    tomorrow: toCalendarDate(new Date(y, m, d + 1)),
    todayClosed,
    nextBoundary: todayClosed ? new Date(y, m, d + 1) : deadline,
  }
}
