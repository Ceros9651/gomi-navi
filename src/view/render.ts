import { ICONS } from '../icons'
import { categoryById } from '../schedule/categories'
import { getCollection, weekdayOf } from '../schedule/schedule'
import type { CalendarDate, CollectionItem } from '../schedule/types'
import type { ViewState } from './clock'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

const dateText = (date: CalendarDate) => `${date.m}/${date.d}（${WEEKDAYS[weekdayOf(date)]}）`

const itemHtml = ({ category, special }: CollectionItem) => {
  const c = categoryById(category)
  return `
    <li class="item cat-${c.id}">
      <details>
        <summary>
          <span class="icon">${ICONS[c.id]}</span>
          <span class="name">${c.name}</span>
          ${special ? '<span class="badge">特別収集</span>' : ''}
          <span class="chevron" aria-hidden="true"></span>
        </summary>
        <ul class="examples">${c.examples.map((e) => `<li>${e}</li>`).join('')}</ul>
      </details>
    </li>`
}

const dayHtml = (label: string, date: CalendarDate, closed: boolean) => {
  const { items, estimated } = getCollection(date)
  return `
    <section class="day${closed ? ' closed' : ''}" aria-label="${label}">
      <h2>
        <span class="label">${label}</span>
        <span class="date">${dateText(date)}</span>
        ${closed && items.length > 0 ? '<span class="closed-badge">締め切り済み（朝8時まで）</span>' : ''}
      </h2>
      ${
        items.length > 0
          ? `<ul class="items">${items.map(itemHtml).join('')}</ul>`
          : '<p class="none">収集なし</p>'
      }
      ${estimated ? '<p class="estimated">推定（未確認）：最新のごみカレンダーで確認してください</p>' : ''}
    </section>`
}

const chipHtml = ({ category, special }: CollectionItem) => {
  const c = categoryById(category)
  return `
    <li class="chip cat-${c.id}" title="${c.name}">
      <span class="chip-icon">${ICONS[c.id]}</span>
      <span class="chip-name">${c.shortName}</span>
      ${special ? '<span class="chip-badge">特別</span>' : ''}
    </li>`
}

/** 2日後以降の1日1行のコンパクトな表示 */
const rowHtml = (date: CalendarDate) => {
  const { items, estimated } = getCollection(date)
  return `
    <li class="row">
      <span class="row-date">${dateText(date)}</span>
      ${
        items.length > 0
          ? `<ul class="chips">${items.map(chipHtml).join('')}</ul>`
          : '<span class="row-none">収集なし</span>'
      }
      ${estimated ? '<span class="row-estimated">推定</span>' : ''}
    </li>`
}

export const weekHtml = ({ days, todayClosed }: ViewState) => {
  const [today, tomorrow, ...upcoming] = days
  return `
    <header class="header">
      <h1>ごみナビ</h1>
      <p class="area">春日井市 E地区</p>
    </header>
    ${dayHtml('今日', today, todayClosed)}
    ${dayHtml('明日', tomorrow, false)}
    <section class="upcoming" aria-label="この先の予定">
      <h2>この先の予定</h2>
      <ol class="week">${upcoming.map(rowHtml).join('')}</ol>
    </section>
    <p class="note">収集日当日の朝8時までに、決められたごみステーションに出してください。</p>`
}

export const render = (root: HTMLElement, state: ViewState) => {
  root.innerHTML = weekHtml(state)
}
