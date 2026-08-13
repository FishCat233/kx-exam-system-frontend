import { defineConfig } from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      kx: {
        white: '#FFFFFF',
        base: '#EFF1F5',
        mantle: '#E6E9EF',
        crust: '#DCE0E8',
        surface: {
          0: '#CCD0DA',
          1: '#BCC0CC',
          2: '#ACB0BE',
        },
        text: '#4C4F69',
        subtext: '#6C6F85',
        blue: '#209FB5',
        teal: '#179299',
        dark: '#181825',
        red: '#D20F39',
        green: '#40A02B',
        yellow: '#DF8E1D',
        // 兼容别名：旧类名仍生效，逐步替换到语义 token
        gray: '#EFF1F5',
        grid: '#CCD0DA',
        black: '#181825',
        ink: '#4C4F69',
        'teal-tint': '#D5ECEA',
      },
    },
    fontFamily: {
      sans: 'system-ui, "Segoe UI", Roboto, sans-serif',
      mono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
    },
  },
  shortcuts: {
    'page-center': 'flex min-h-screen items-center justify-center bg-kx-base px-4',
    'card-base': 'rounded-lg border border-kx-surface0 bg-white',
    'panel-side': 'rounded-lg border border-kx-surface0 bg-kx-base',
    'input-login':
      'h-12 w-full rounded-lg border border-solid bg-white px-3.5 text-kx-text transition-all duration-150 placeholder:text-kx-surface1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kx-blue disabled:cursor-not-allowed disabled:bg-kx-mantle disabled:text-kx-subtext',
    'alert-error':
      'flex items-center gap-1.5 rounded-md border border-kx-red bg-kx-red/10 px-3 py-2',
    'alert-warning':
      'flex items-center gap-1.5 rounded-md border border-kx-yellow bg-kx-yellow/10 px-3 py-2',
    'alert-info':
      'flex items-center gap-1.5 rounded-md border border-kx-blue bg-kx-blue/10 px-3 py-2',
    'data-mono': 'font-mono tabular-nums',
  },
})
