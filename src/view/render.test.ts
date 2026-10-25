import { describe, expect, it } from 'vitest'
import { getViewState } from './clock'
import { weekHtml } from './render'

const html = (y: number, m: number, d: number, h = 10) =>
  weekHtml(getViewState(new Date(y, m - 1, d, h)))

/** 今日・明日のカード（section.day）を順に取り出す */
const cards = (s: string) => s.split('<section class="day').slice(1).map((c) => c.split('</section>')[0])

/** 2日後以降のコンパクトな行を順に取り出す */
const rows = (s: string) => s.split('<li class="row">').slice(1).map((r) => r.split('</li>\n    <li class="row">')[0])

const dateOf = (row: string) => row.match(/<span class="row-date">(.+?)<\/span>/)![1]
const categoriesOf = (row: string) => [...row.matchAll(/class="chip cat-(\w+)"/g)].map((m) => m[1])

describe('weekHtml', () => {
  it('9/29（火）は今日・明日のカードと、続く5日分の行を表示する', () => {
    const s = html(2026, 9, 29)
    const [today, tomorrow] = cards(s)
    expect(cards(s)).toHaveLength(2)
    expect(today).toContain('今日')
    expect(today).toContain('9/29（火）')
    expect(today).toContain('cat-burnable')
    expect(tomorrow).toContain('明日')
    expect(tomorrow).toContain('9/30（水）')
    expect(tomorrow).toContain('収集なし')

    const r = rows(s)
    expect(r.map(dateOf)).toEqual(['10/1（木）', '10/2（金）', '10/3（土）', '10/4（日）', '10/5（月）'])
    expect(r.map(categoriesOf)).toEqual([['nonBurnable', 'plastic'], ['burnable'], [], [], ['paperClothes']])
    expect(r[2]).toContain('収集なし')
    expect(r[3]).toContain('収集なし')
    expect(s).not.toContain('10/6')
  })

  it('行には短い名前とアイコンを出し、品目例の開閉は出さない', () => {
    const [row] = rows(html(2026, 9, 29))
    expect(row).toContain('<span class="chip-name">プラ</span>')
    expect(row).toContain('<span class="chip-name">燃やせない</span>')
    expect(row).toContain('<svg')
    expect(row).not.toContain('<details')
  })

  it('月末は 10/6（火）が最後の行になる', () => {
    expect(rows(html(2026, 9, 30)).map(dateOf).at(-1)).toBe('10/6（火）')
  })

  it('8:00 以降は今日だけが締め切り済みで、2日後以降の行には締め切り表示がない', () => {
    const s = html(2026, 9, 29, 8)
    const [today, tomorrow] = cards(s)
    expect(today).toContain('締め切り済み')
    expect(tomorrow).not.toContain('締め切り済み')
    for (const r of rows(s)) expect(r).not.toContain('締め切り')
  })

  it('12/27 は 12/29（火）の行の燃やせるごみに特別収集を表示する', () => {
    const r = rows(html(2026, 12, 27))
    const special = r.find((row) => dateOf(row) === '12/29（火）')!
    expect(categoriesOf(special)).toEqual(['burnable'])
    expect(special).toContain('<span class="chip-badge">特別</span>')
    expect(r.filter((row) => row.includes('chip-badge'))).toHaveLength(1)
  })

  it('12/28 は 2027-01-01〜01-03 の行だけに推定を表示する', () => {
    const s = html(2026, 12, 28)
    expect(s).not.toContain('class="estimated"')
    const r = rows(s)
    expect(r.map(dateOf)).toEqual(['12/30（水）', '12/31（木）', '1/1（金）', '1/2（土）', '1/3（日）'])
    expect(r.map((row) => row.includes('row-estimated'))).toEqual([false, false, true, true, true])
  })

  it('範囲外の今日のカードには推定の注記を表示する', () => {
    const [today] = cards(html(2027, 1, 5))
    expect(today).toContain('推定（未確認）：最新のごみカレンダーで確認してください')
  })
})
