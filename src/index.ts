import { definePreset, mergeConfigs, mergeDeep } from '@unocss/core'
import { colorToString as unoColorToString } from '@unocss/rule-utils'
import { parseToRgba } from 'color2k'
import type { Rule } from '@unocss/core'
import { DEFAULT_VAR_PREFIX, LAYER_NAME, LAYER_NAME_DARK, RULE_KEYWORD, THEME_KEYS } from './constants'
import { normalizeName, omit } from './utils'

interface ColorValue {
  [key: string]: ColorValue & {
    DEFAULT_DARK?: string
    DEFAULT?: string
  } | string
}

interface Theme {
  colors?: ColorValue
}

export interface PresetDarkOptions {
  varPrefix?: string
  colors?: ColorValue
}

interface ThemeVar {
  DEFAULT_DARK: string
  DEFAULT: string
  DEFAULT_DARKAlpha?: number
  DEFAULTAlpha?: number
}

const presetDark = definePreset<PresetDarkOptions, Theme>((options = {}) => {
  const { varPrefix = DEFAULT_VAR_PREFIX, colors = {} } = options
  const themeVars = new Map<string, ThemeVar>()
  const touchedColors = new Set<string>()

  function addThemeVars(_themeName: string, color: string, theme: 'DEFAULT_DARK' | 'DEFAULT'): {
    target: ThemeVar
    color: number[]
    colorStr: string
  } {
    const colorComponent = parseToRgba(color)
    const [r, g, b, a] = colorComponent
    const hasAlpha = a !== void 0 && a !== 1

    if (!themeVars.has(_themeName)) {
      themeVars.set(_themeName, {
        DEFAULT_DARK: '',
        DEFAULT: '',
      })
    }

    const targetTheme = themeVars.get(_themeName)!
    targetTheme[theme] = `${r} ${g} ${b}`
    if (hasAlpha) {
      targetTheme[`${theme}Alpha`] = a
    }

    const varName = `${varPrefix}-${_themeName}`
    return {
      target: targetTheme,
      color: colorComponent,
      colorStr: unoColorToString(`rgb(var(${varName}) / <alpha-value>)`, hasAlpha ? `var(${varName}--alpha)` : undefined),
    }
  }

  function generateColors(colors: ColorValue, prefix = ''): ColorValue {
    return Object.entries(colors).reduce((acc, [key, value]) => {
      let result = {} as ColorValue
      const name = normalizeName(prefix, key).replace(/^-/, '')
      if (typeof value === 'object') {
        THEME_KEYS.forEach((i) => {
          if (Object.prototype.hasOwnProperty.call(value, i)) {
            const themeName = normalizeName(name, i)
            const { colorStr } = addThemeVars(themeName, value[i] as string, i as ('DEFAULT_DARK' | 'DEFAULT'))
            result[themeName] = colorStr
          }
        })

        result = mergeDeep(result, generateColors(omit(value, THEME_KEYS), `${prefix + key}`))
      }
      else {
        const { colorStr } = addThemeVars(name, value, 'DEFAULT')
        result[name] = colorStr
      }
      return {
        ...acc,
        ...result,
      }
    }, {} as ColorValue)
  }

  const rules: Rule<Theme>[] = [
    [
      new RegExp(`^${RULE_KEYWORD}-(${THEME_KEYS.join('|')})`),
      ([,mode], { symbols, constructCSS }) => {
        const isDark = mode === THEME_KEYS[0]
        const vars: Record<string, string | number> = {}
        touchedColors.forEach((themeName) => {
          const themeVar = themeVars.get(themeName)
          if (themeVar) {
            const { DEFAULT_DARK, DEFAULT, DEFAULT_DARKAlpha, DEFAULTAlpha } = themeVar
            const key = `${varPrefix}-${themeName}`
            const keyAlpha = `${key}--alpha`
            const val = isDark ? DEFAULT_DARK : DEFAULT
            const alpha = isDark ? DEFAULT_DARKAlpha : DEFAULTAlpha
            if (val) {
              vars[key] = val
              if (alpha)
                vars[keyAlpha] = alpha
            }
          }
        })
        const css = constructCSS(vars)
        let selector = ' '
        if (!isDark) {
          selector = ',:root'
        }
        if (css.includes('@media'))
          selector = ':root'
        return {
          [symbols.selector]: () => selector,
          ...vars,
        }
      },
    ],
  ]

  return {
    name: 'unocss-preset-duo',
    theme: {
      colors: generateColors(colors),
    },
    layers: {
      [LAYER_NAME]: -1,
      [LAYER_NAME_DARK]: 0,
      default: 1,
    },
    postprocess(u) {
      u.entries.forEach(([,val]) => {
        if (typeof val !== 'string')
          return
        const matchReg = new RegExp(`var\\(${varPrefix}-([\\w-]+)\\)`)
        const matchRes = val.match(matchReg)
        if (matchRes === null)
          return
        const themeName = matchRes[1].replace('--alpha', '')
        touchedColors.add(themeName)
      })
    },
    preflights: [
      {
        layer: LAYER_NAME,
        getCSS: async (ctx) => {
          ctx.generator.setConfig(mergeConfigs([ctx.generator.userConfig, {
            rules,
          }]))
          const { css } = await ctx.generator.generate(`light:${RULE_KEYWORD}-${THEME_KEYS[1]}`, { preflights: false, minify: true })
          return css
        },
      },
      {
        layer: LAYER_NAME_DARK,
        getCSS: async (ctx) => {
          ctx.generator.setConfig(mergeConfigs([ctx.generator.userConfig, {
            rules,
          }]))
          const { css } = await ctx.generator.generate(`dark:${RULE_KEYWORD}-${THEME_KEYS[0]}`, { preflights: false, minify: true })
          return css
        },
      },
    ],

  }
})
export default presetDark
export { presetDark }
