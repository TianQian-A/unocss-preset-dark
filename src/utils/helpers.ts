import { THEME_KEYS } from '../constants'

export function normalizeName(prefix: string, key: string): string {
  return `${prefix}${THEME_KEYS.includes(key) ? '' : `-${key}`}`
}
