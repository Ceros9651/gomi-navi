import { describe, expect, it } from 'vitest'
import { shouldShowHint } from './install-hint'

describe('shouldShowHint', () => {
  it('iPhoneのSafariで初めて開いたときは表示する', () => {
    expect(shouldShowHint({ ios: true, standalone: false, dismissed: false })).toBe(true)
  })
  it('閉じた後は表示しない', () => {
    expect(shouldShowHint({ ios: true, standalone: false, dismissed: true })).toBe(false)
  })
  it('ホーム画面から起動したときは表示しない', () => {
    expect(shouldShowHint({ ios: true, standalone: true, dismissed: false })).toBe(false)
  })
  it('iOS以外では表示しない（案内の手順がSafari向けのため）', () => {
    expect(shouldShowHint({ ios: false, standalone: false, dismissed: false })).toBe(false)
  })
})
