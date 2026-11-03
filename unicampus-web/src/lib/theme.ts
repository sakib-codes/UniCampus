/**
 * UniCampus Centralized Theme Controller
 * Defines color palettes, semantic design tokens, and shared UI classes.
 * Single source of truth for GitHub Dark theme (#010409, #0D1117, #6E747D, #F0F6FC).
 */

export const THEME_PALETTES = {
  githubDark: {
    name: 'GitHub Dark',
    canvas: '#010409',       // Deepest canvas 0xFF010409
    surface: '#0D1117',      // Primary card & panel surface 0xFF0D1117
    surfaceSecondary: '#161B22', // Secondary surface
    subtle: '#1C2128',       // Inset areas, table hover, input track
    border: '#30363D',       // GitHub structural 1px border
    borderSubtle: '#21262D', // Subtle row divider
    borderAccent: '#484F58', // Stronger border
    muted: '#6E747D',        // Subtitle & less important text 0xFF6E747D
    text: '#F0F6FC',         // High contrast text 0xFFF0F6FC
    textSecondary: '#8D96A0',// Secondary body copy
    buttonFill: '#F0F6FC',   // Button fill 0xFFF0F6FC
    buttonText: '#010409',   // Inside button text color (contrast black)
    buttonSecondaryBg: '#21262D',
    brand: '#1D5BD8',        // UniCampus signature Royal Cobalt Blue
    brandHover: '#1548B0',
    brandLight: 'rgba(29, 91, 216, 0.15)',
  },
} as const;

export const BRAND_COLORS = {
  primary: '#1D5BD8',
  hover: '#1548B0',
  darkPrimary: '#2563EB',
  darkHover: '#3B82F6',
} as const;

export const SPOTLIGHT = {
  glow: 'rgba(29, 91, 216, 0.65)',
  wash: 'rgba(29, 91, 216, 0.16)',
} as const;

/**
 * Shared Tailwind CSS utility classes driven by semantic design tokens.
 * Use these across components to avoid hardcoded hex codes.
 */
export const themeTokens = {
  // Layout & Backgrounds
  canvas: 'bg-[#F0F4FA] dark:bg-[#060A14]',
  surface: 'bg-white/78 dark:bg-[#0B1220]/75 backdrop-blur-2xl',
  surfaceSecondary: 'bg-white/58 dark:bg-[#101A2E]/65 backdrop-blur-xl',
  subtle: 'bg-blue-900/[0.035] dark:bg-white/[0.04]',
  subtleHover: 'hover:bg-white/60 dark:hover:bg-white/10',
  accentBg: 'bg-[#1D5BD8]/10 dark:bg-[#2563EB]/15',

  // Borders
  border: 'border-white/88 dark:border-white/12',
  borderSubtle: 'border-white/60 dark:border-white/8',
  borderAccent: 'border-white dark:border-white/20',

  // Cards & Containers
  card: 'bg-white/78 dark:bg-[#0B1220]/75 backdrop-blur-2xl border border-white/88 dark:border-white/12 rounded-2xl shadow-[0_10px_30px_-10px_rgba(29,91,216,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] dark:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)]',
  cardInteractive: 'bg-white/78 dark:bg-[#0B1220]/75 backdrop-blur-2xl border border-white/88 dark:border-white/12 hover:border-white hover:bg-white/90 dark:hover:bg-[#0B1220]/85 rounded-2xl shadow-[0_10px_30px_-10px_rgba(29,91,216,0.06),inset_0_1px_1px_rgba(255,255,255,0.95)] dark:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] hover:shadow-[0_20px_40px_-12px_rgba(29,91,216,0.12)] transition-all duration-300',
  card3xl: 'bg-white/75 dark:bg-[#0B1220]/75 backdrop-blur-3xl border border-white/90 dark:border-white/12 rounded-3xl shadow-[0_20px_50px_-15px_rgba(29,91,216,0.08),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65),inset_0_1.5px_1.5px_rgba(255,255,255,0.15)]',
  card3xlInteractive: 'bg-white/75 dark:bg-[#0B1220]/75 backdrop-blur-3xl border border-white/90 dark:border-white/12 hover:border-white hover:bg-white/90 dark:hover:bg-[#0B1220]/85 rounded-3xl shadow-[0_20px_50px_-15px_rgba(29,91,216,0.08),inset_0_1.5px_1.5px_rgba(255,255,255,0.95)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65),inset_0_1.5px_1.5px_rgba(255,255,255,0.15)] hover:shadow-[0_25px_60px_-12px_rgba(29,91,216,0.14)] transition-all duration-300',
  cardFlat: 'bg-white/65 dark:bg-[#0B1220]/65 backdrop-blur-xl border border-white/85 dark:border-white/12 rounded-xl',
  cardRecessed: 'bg-blue-900/[0.035] dark:bg-white/[0.03] backdrop-blur-md border border-white/70 dark:border-white/10 rounded-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]',
  cardRecessed2xl: 'bg-blue-900/[0.035] dark:bg-white/[0.03] backdrop-blur-md border border-white/70 dark:border-white/10 rounded-2xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]',
  cardElevated: 'bg-white/80 dark:bg-[#0B1220]/80 backdrop-blur-2xl border border-white/95 dark:border-white/15 rounded-2xl shadow-[0_16px_36px_-10px_rgba(29,91,216,0.09),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-[0_22px_45px_-10px_rgba(29,91,216,0.14)] transition-shadow',
  cardSolid: 'bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-2xl shadow-xl',
  cardInset: 'bg-slate-50/90 dark:bg-[#161B22] border border-slate-200/90 dark:border-[#30363D] rounded-xl',
  cardInsetSolid: 'bg-slate-50 dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] rounded-xl',
  drawer: 'bg-white/85 dark:bg-[#0D1117] rounded-3xl border border-white/88 dark:border-[#30363D] backdrop-blur-xl shadow-xl',
  panel: 'bg-white/78 dark:bg-[#0B1220]/75 backdrop-blur-2xl border border-white/88 dark:border-white/12',

  // Typography
  textPrimary: 'text-[#0A192F] dark:text-[#F0F6FC]',
  textSecondary: 'text-[#334155] dark:text-[#94A3B8]',
  textMuted: 'text-[#64748B] dark:text-[#64748B]',
  textBrand: 'text-brand',
  textBrandHover: 'hover:text-brand-hover',
  heading: 'font-extrabold text-[#0A192F] dark:text-[#F0F6FC] tracking-tight',
  subheading: 'text-xs font-semibold text-[#334155] dark:text-[#94A3B8]',

  // Buttons - Royal Cobalt Palette
  btnHero: 'bg-[#1D5BD8] hover:bg-[#1548B0] text-white dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] font-bold rounded-2xl shadow-[0_4px_16px_rgba(29,91,216,0.30)] hover:shadow-[0_6px_20px_rgba(29,91,216,0.40)] transition-all active:scale-[0.98] cursor-pointer',
  btnPrimary: 'bg-brand hover:bg-brand-hover text-white font-bold rounded-2xl shadow-[0_6px_20px_rgba(29,91,216,0.30)] hover:shadow-[0_8px_25px_rgba(29,91,216,0.40)] transition-all active:scale-[0.98] cursor-pointer',
  btnBrand: 'bg-[#1D5BD8] hover:bg-[#1548B0] dark:bg-[#2563EB] dark:hover:bg-[#3B82F6] text-white font-bold rounded-2xl shadow-[0_6px_20px_rgba(29,91,216,0.30)] hover:shadow-[0_8px_25px_rgba(29,91,216,0.40)] transition-all active:scale-[0.98] cursor-pointer',
  btnSecondary: 'bg-white/80 hover:bg-white text-[#1E293B] dark:bg-white/10 dark:hover:bg-white/15 dark:text-[#F0F6FC] border border-white/95 dark:border-white/15 font-bold rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all cursor-pointer',
  btnSecondarySolid: 'bg-white dark:bg-[#161B22] hover:bg-slate-50 dark:hover:bg-[#21262D] text-slate-700 dark:text-[#F0F6FC] border border-slate-200 dark:border-[#30363D] font-semibold rounded-xl shadow-xs transition-all cursor-pointer active:scale-[0.98]',
  btnGhost: 'text-[#64748B] hover:text-[#0A192F] hover:bg-white/60 dark:text-[#8D96A0] dark:hover:text-[#F0F6FC] dark:hover:bg-white/10 rounded-2xl transition-all cursor-pointer',
  btnDanger: 'bg-rose-50/80 hover:bg-rose-100/90 text-rose-600 border border-rose-200/80 dark:bg-rose-950/30 dark:hover:bg-rose-950/50 dark:text-rose-400 dark:border-rose-900/50 font-bold rounded-2xl transition-all cursor-pointer',
  btnDangerSecondary: 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 dark:bg-[#161B22] dark:hover:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30 text-xs font-semibold rounded-xl transition-all cursor-pointer',

  // Inputs, Selects & Forms
  input: 'bg-white/70 dark:bg-black/35 backdrop-blur-md border border-white/88 dark:border-white/10 text-[#0A192F] dark:text-[#F0F6FC] placeholder-[#94A3B8] dark:placeholder-[#64748B] shadow-[inset_0_1.5px_2.5px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_1.5px_2.5px_rgba(0,0,0,0.35)] focus:outline-none focus:border-[#1D5BD8] dark:focus:border-[#2563EB] focus:bg-white/95 dark:focus:bg-black/50 focus:ring-4 focus:ring-[#1D5BD8]/12 rounded-2xl text-sm transition-all',
  inputSolid: 'bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-900 dark:text-[#F0F6FC] placeholder:text-slate-400 dark:placeholder:text-[#8D96A0] focus:outline-none focus:border-[#1D5BD8] dark:focus:border-[#2563EB] rounded-xl text-xs transition-all',
  select: 'bg-white/70 dark:bg-black/35 backdrop-blur-md border border-white/88 dark:border-white/10 text-[#0A192F] dark:text-[#F0F6FC] focus:outline-none focus:border-[#1D5BD8] dark:focus:border-[#2563EB] focus:bg-white/95 dark:focus:bg-black/50 rounded-2xl text-sm transition-all',
  selectSolid: 'bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#30363D] text-slate-900 dark:text-[#F0F6FC] focus:outline-none focus:border-[#1D5BD8] dark:focus:border-[#2563EB] rounded-xl text-xs transition-all cursor-pointer',

  // Segmented Tabs / Navigation Tracks
  tabTrack: 'bg-blue-900/[0.04] dark:bg-white/[0.04] backdrop-blur-md p-1 border border-white/70 dark:border-white/10 rounded-2xl shadow-inner',
  tabActive: 'bg-white text-[#0A192F] dark:bg-[#152136] dark:text-[#F0F6FC] shadow-[0_2px_8px_rgba(29,91,216,0.08),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] border border-white dark:border-white/20 font-bold rounded-xl',
  tabInactive: 'text-[#64748B] dark:text-[#8D96A0] hover:text-[#0A192F] dark:hover:text-[#F0F6FC] font-semibold hover:bg-white/30 dark:hover:bg-white/5 rounded-xl',
  tabSelected: 'bg-[#1D5BD8]/15 text-[#1D5BD8] border border-[#1D5BD8]/30 dark:bg-[#2563EB]/20 dark:text-[#60A5FA] font-bold rounded-xl',

  // Data Tables
  tableHeader: 'bg-black/[0.035] dark:bg-white/[0.03] backdrop-blur-md text-[#64748B] dark:text-[#8D96A0] border-b border-white/70 dark:border-white/10 text-[11px] font-bold font-mono uppercase tracking-wider',
  tableHeaderSolid: 'bg-slate-50 dark:bg-[#161B22] border-b border-slate-200 dark:border-[#30363D] text-slate-500 dark:text-[#8D96A0] text-xs font-semibold',
  tableRow: 'border-b border-white/50 dark:border-white/5 hover:bg-white/40 dark:hover:bg-white/5 transition-colors',
  tableRowSolid: 'border-b border-slate-200 dark:border-[#30363D]/60 hover:bg-slate-50/80 dark:hover:bg-[#161B22]/50 transition-colors',
  tableFooter: 'bg-slate-50/90 dark:bg-[#161B22]/90 border-t border-slate-200 dark:border-[#30363D] text-slate-600 dark:text-[#8D96A0] text-xs font-mono',

  // Modals & Overlays
  modalOverlay: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-150',
  modalBox: 'bg-white/95 dark:bg-[#0D1117] border border-slate-200 dark:border-[#30363D] rounded-3xl shadow-2xl relative overflow-hidden',
  dropdown: 'frosted-glass-dropdown dropdown-glass rounded-3xl p-5 shadow-2xl z-50 text-slate-800 dark:text-[#F0F6FC]',
  popover: 'frosted-glass-dropdown dropdown-glass rounded-2xl p-2 shadow-2xl z-50 text-slate-800 dark:text-[#F0F6FC]',
  toast: 'fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-[#161B22] border border-slate-200 dark:border-[#2563EB]/40 text-slate-900 dark:text-[#F0F6FC] shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200',

  // Badges
  badgeBrand: 'bg-[#1D5BD8]/10 dark:bg-[#2563EB]/15 text-[#1D5BD8] dark:text-[#60A5FA] border border-[#1D5BD8]/25 dark:border-[#2563EB]/30 font-semibold',
  badgeAdmin: 'bg-blue-50 dark:bg-[#2563EB]/20 text-[#1D5BD8] dark:text-[#60A5FA] border border-[#1D5BD8]/30 dark:border-[#2563EB]/40 font-semibold',
  badgeTeacher: 'bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-300/40 dark:border-sky-500/30 font-semibold',
  badgeStudent: 'bg-blue-50/60 dark:bg-[#2563EB]/10 text-[#1D5BD8] dark:text-[#93C5FD] border border-[#1D5BD8]/20 dark:border-[#2563EB]/25 font-semibold',
  badgeSuccess: 'bg-emerald-500/10 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border border-emerald-500/25 dark:border-emerald-900/50 font-semibold',
  badgeWarning: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/50',
  badgeError: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50',
  badgeInfo: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50',
} as const;

export type ThemeTokens = typeof themeTokens;

