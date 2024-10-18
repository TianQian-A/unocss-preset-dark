# unocss-preset-dark

Automatic switching dark CSS var for UnoCSS.

## Installation
```
npm i -D unocss-preset-dark
```

## Usage

```ts
import { defineConfig, presetMini } from 'unocss'
import presetDark from 'unocss-preset-dark'

export default defineConfig({
  presets: [presetMini(), presetDark({
    colors: {
      track: '#5D81D0',
      link: {
        DEFAULT: '#567b94',
        DEFAULT_DARK: '#5b77a4',
      },
      text: {
        DEFAULT_DARK: '#cccccc',
        DEFAULT: '#222222',
        second: {
          DEFAULT: '#a6a6a6',
          DEFAULT_DARK: '#666666',
        },
        third: {
          DEFAULT: '#888888',
          DEFAULT_DARK: '#737373',
        },
      },
      button: {
        second: {
          DEFAULT: '#F2F2F2',
          DEFAULT_DARK: '#2B2B2B',
        },
      },
    }
  })],
})
```
```html
<div class="light:text-link bg-like hover:bg-text"></div>
```
This will generate the following CSS:
```css

/* layer: dark-theme */
.light,
:root {
  --dark-var-like: 253 79 55;
  --dark-var-link: 86 123 148;
  --dark-var-button-second: 242 242 242;
}
/* layer: dark-theme-dark */
.dark {
  --dark-var-link: 91 119 164;
  --dark-var-button-second: 43 43 43;
}
/* layer: default */
.bg-like {
  --un-bg-opacity: 1;
  background-color: rgb(var(--dark-var-like) / var(--un-bg-opacity));
}
.hover\:bg-button-second:hover {
  --un-bg-opacity: 1;
  background-color: rgb(var(--dark-var-button-second) / var(--un-bg-opacity));
}
.text-link {
  --un-text-opacity: 1;
  color: rgb(var(--dark-var-link) / var(--un-text-opacity));
}
```
## Configs
```ts
import { defineConfig, presetMini } from 'unocss'
import presetDark from 'unocss-preset-dark'

export default defineConfig({
  presets: [
    presetMini(),
    presetDark({
    /**
     * Custom css var prefix
     */
      varPrefix: '--dark-var',
      /**
       * Color themes
       * interface ColorValue {
       *   [key: string]: ColorValue & {
       *     DEFAULT_DARK?: string
       *     DEFAULT?: string
       *   } | string
       * }
       */
      colors: {
        track: '#5D81D0',
        link: {
          DEFAULT: '#567b94',
          DEFAULT_DARK: '#5b77a4',
        },
        text: {
          DEFAULT_DARK: '#cccccc',
          DEFAULT: '#222222',
          second: {
            DEFAULT: '#a6a6a6',
            DEFAULT_DARK: '#666666',
          },
          third: {
            DEFAULT: '#888888',
            DEFAULT_DARK: '#737373',
          },
        },
        button: {
          second: {
            DEFAULT: '#F2F2F2',
            DEFAULT_DARK: '#2B2B2B',
          },
        },
      }
    })
  ],
})
```
