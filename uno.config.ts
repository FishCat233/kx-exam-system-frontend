import { defineConfig } from 'unocss'

export default defineConfig({
  shortcuts: {
    'page-center': 'flex min-h-screen items-center justify-center bg-slate-100 px-4',
    'card-base': 'rounded-2xl border border-slate-200 bg-white shadow-sm',
    'btn-primary':
      'bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors',
    'btn-gradient':
      'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 outline-none transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg',
    'btn-danger': 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium rounded-lg transition-colors',
    'input-base':
      'w-full bg-white border border-slate-200 rounded-xl shadow-sm text-slate-700 placeholder:text-slate-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-300',
    'alert-error': 'flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-200 rounded-lg',
    'alert-warning': 'flex items-center gap-1.5 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg',
    'section-label': 'text-sm font-medium uppercase tracking-[0.18em] text-blue-600',
  },
})
