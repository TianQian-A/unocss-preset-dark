import { createGenerator, mergeDeep } from '@unocss/core'
import presetMini from '@unocss/preset-mini'
import { describe, expect, it } from 'vitest'
import type { PresetMiniOptions } from '@unocss/preset-mini'
import presetDark from '../src'
import { Colors } from './color'
import type { PresetDarkOptions } from '../src'

describe('presetDuo', () => {
  const createUno = (options?: {
    miniOptions?: PresetMiniOptions
    darkOptions?: PresetDarkOptions
  }) => createGenerator({
    presets: [
      presetMini(options?.miniOptions),
      presetDark(mergeDeep({
        colors: Colors,
      }, options?.darkOptions || {})),
    ],
  })
  it('basic usage', async () => {
    const uno = createUno({
      miniOptions: {
        dark: 'class',
      },
    })
    const { css } = await uno.generate('text-link bg-like hover:bg-button-second')
    expect(css).toMatchInlineSnapshot(`
      "/* layer: preflights */
      *,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}
      /* layer: dark-theme */
      .light ,:root{--dark-var-like:253 79 55;--dark-var-link:86 123 148;--dark-var-button-second:242 242 242;}
      /* layer: dark-theme-dark */
      .dark {--dark-var-link:91 119 164;--dark-var-button-second:43 43 43;}
      /* layer: default */
      .bg-like{--un-bg-opacity:1;background-color:rgb(var(--dark-var-like) / var(--un-bg-opacity));}
      .hover\\:bg-button-second:hover{--un-bg-opacity:1;background-color:rgb(var(--dark-var-button-second) / var(--un-bg-opacity));}
      .text-link{--un-text-opacity:1;color:rgb(var(--dark-var-link) / var(--un-text-opacity));}"
    `)
  })

  it('custom varPrefix', async () => {
    const uno = createUno({
      darkOptions: {
        varPrefix: '--custom-var-prefix',
      },
    })
    const { css } = await uno.generate('text-link bg-content hover:bg-content-second')
    expect(css).toMatchInlineSnapshot(`
      "/* layer: preflights */
      *,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}
      /* layer: dark-theme */
      .light ,:root{--custom-var-prefix-content:255 255 255;--custom-var-prefix-link:86 123 148;--custom-var-prefix-content-second:247 247 247;}
      /* layer: dark-theme-dark */
      .dark {--custom-var-prefix-content:24 24 24;--custom-var-prefix-link:91 119 164;--custom-var-prefix-content-second:33 33 33;}
      /* layer: default */
      .bg-content{--un-bg-opacity:1;background-color:rgb(var(--custom-var-prefix-content) / var(--un-bg-opacity));}
      .hover\\:bg-content-second:hover{--un-bg-opacity:1;background-color:rgb(var(--custom-var-prefix-content-second) / var(--un-bg-opacity));}
      .text-link{--un-text-opacity:1;color:rgb(var(--custom-var-prefix-link) / var(--un-text-opacity));}"
    `)
  })

  it('color opacity', async () => {
    const uno = createUno({
      darkOptions: {
        colors: {
          opacity: {
            one: {
              DEFAULT: 'rgba(0, 0, 0, 0.1)',
              DEFAULT_DARK: 'rgb(255, 255, 255, 0.1)',
            },
            two: {
              DEFAULT: 'rgb(0, 0, 0, 0.2)',
              DEFAULT_DARK: 'rgb(255, 255, 255, 0.2)',
            },
          },
        },
      },
    })
    const { css } = await uno.generate('text-opacity-one text-opacity-40 bg-opacity-two bg-opacity-60')
    expect(css).toMatchInlineSnapshot(`
      "/* layer: preflights */
      *,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / 0.5);}
      /* layer: dark-theme */
      .light ,:root{--dark-var-opacity-two:0 0 0;--dark-var-opacity-two--alpha:0.2;--dark-var-opacity-one:0 0 0;--dark-var-opacity-one--alpha:0.1;}
      /* layer: dark-theme-dark */
      .dark {--dark-var-opacity-two:255 255 255;--dark-var-opacity-two--alpha:0.2;--dark-var-opacity-one:255 255 255;--dark-var-opacity-one--alpha:0.1;}
      /* layer: default */
      .bg-opacity-two{--un-bg-opacity:var(--dark-var-opacity-two--alpha);background-color:rgb(var(--dark-var-opacity-two) / var(--un-bg-opacity));}
      .bg-opacity-60{--un-bg-opacity:0.6;}
      .text-opacity-one{--un-text-opacity:var(--dark-var-opacity-one--alpha);color:rgb(var(--dark-var-opacity-one) / var(--un-text-opacity));}
      .text-opacity-40{--un-text-opacity:0.4;}"
    `)
  })
})
