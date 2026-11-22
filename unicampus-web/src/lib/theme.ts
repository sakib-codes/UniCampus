/**
 * UniCampus Centralized Theme Controller
 * Defines Option A Indigo color palettes, semantic design tokens, and shared UI classes.
 */

export const THEME_PALETTES = {
  githubDark: {
    name: 'Option A Indigo Dark',
    canvas: '#0B0B10',
    surface: '#15151D',
    surfaceSecondary: '#1C1C26',
    subtle: '#1C1C26',
    border: '#262630',
    borderSubtle: '#262630',
    borderAccent: '#363646',
    muted: '#9C9CAE',
    text: '#EDEDF3',
    textSecondary: '#9C9CAE',
    buttonFill: '#7C78FF',
    buttonText: '#FFFFFF',
    buttonSecondaryBg: '#1C1C26',
    brand: '#7C78FF',
    brandHover: '#918EFF',
    brandLight: 'rgba(124, 120, 255, 0.14)',
  },
} as const;

export const BRAND_COLORS = {
  primary: '#605BFF',
  hover: '#4E49EB',
  darkPrimary: '#7C78FF',
  darkHover: '#918EFF',
} as const;

export const SPOTLIGHT = {
  glow: 'rgba(96, 91, 255, 0.65)',
  wash: 'rgba(96, 91, 255, 0.16)',
} as const;

/**
 * Shared Tailwind CSS utility classes driven by semantic design tokens.
 * Solid Option A Indigo surfaces, hairline borders, 13px minimum captions.
 */
export const themeTokens = {
  // Layout & Backgrounds
  canvas: 'bg-canvas',
  surface: 'bg-surface',
  surfaceSecondary: 'bg-surface-2',
  subtle: 'bg-surface-2',
  subtleHover: 'hover:bg-surface-2',
  accentBg: 'bg-brand-soft',

  // Borders
  border: 'border-line',
  borderSubtle: 'border-line/70',
  borderAccent: 'border-line',

  // Cards & Containers
  card: 'bg-surface border border-line rounded-2xl',
  cardInteractive: 'bg-surface border border-line hover:border-brand/40 rounded-2xl transition-colors duration-150',
  card3xl: 'bg-surface border border-line rounded-2xl',
  card3xlInteractive: 'bg-surface border border-line hover:border-brand/40 rounded-2xl transition-colors duration-150',
  cardFlat: 'bg-surface border border-line rounded-2xl',
  cardRecessed: 'bg-surface-2 border border-line rounded-xl',
  cardRecessed2xl: 'bg-surface-2 border border-line rounded-2xl',
  cardElevated: 'bg-surface border border-line rounded-2xl',
  cardSolid: 'bg-surface border border-line rounded-2xl',
  cardInset: 'bg-surface-2 border border-line rounded-xl',
  cardInsetSolid: 'bg-surface-2 border border-line rounded-xl',
  drawer: 'bg-surface border border-line rounded-2xl shadow-xl',
  panel: 'bg-surface border border-line',

  // Typography
  textPrimary: 'text-fg',
  textSecondary: 'text-fg-muted',
  textMuted: 'text-fg-muted',
  textBrand: 'text-brand',
  textBrandHover: 'hover:text-brand-hover',
  heading: 'font-semibold text-fg tracking-tight',
  subheading: 'text-xs font-medium text-fg-muted',

  // Buttons - Option A Indigo
  btnHero: 'bg-brand hover:bg-brand-hover text-on-brand font-semibold rounded-xl transition-colors active:scale-[0.98] cursor-pointer',
  btnPrimary: 'bg-brand hover:bg-brand-hover text-on-brand font-semibold rounded-xl transition-colors active:scale-[0.98] cursor-pointer',
  btnBrand: 'bg-brand hover:bg-brand-hover text-on-brand font-semibold rounded-xl transition-colors active:scale-[0.98] cursor-pointer',
  btnSecondary: 'bg-surface hover:bg-surface-2 text-fg border border-line font-medium rounded-xl transition-colors cursor-pointer',
  btnSecondarySolid: 'bg-surface hover:bg-surface-2 text-fg border border-line font-medium rounded-xl transition-colors cursor-pointer active:scale-[0.98]',
  btnGhost: 'text-fg-muted hover:text-fg hover:bg-surface-2 rounded-xl transition-colors cursor-pointer',
  btnDanger: 'bg-danger-light hover:bg-danger/15 text-danger border border-danger/25 font-medium rounded-xl transition-colors cursor-pointer',
  btnDangerSecondary: 'bg-danger-light hover:bg-danger/15 text-danger border border-danger/25 text-xs font-medium rounded-xl transition-colors cursor-pointer',

  // Inputs, Selects & Forms
  input: 'bg-surface border border-line text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 rounded-xl text-sm transition-colors duration-150',
  inputSolid: 'bg-surface border border-line text-fg placeholder:text-fg-subtle focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 rounded-xl text-sm transition-colors duration-150',
  select: 'bg-surface border border-line text-fg focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 rounded-xl text-sm transition-colors duration-150',
  selectSolid: 'bg-surface border border-line text-fg focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 rounded-xl text-sm transition-colors duration-150 cursor-pointer',

  // Segmented Tabs / Navigation Tracks
  tabTrack: 'bg-surface-2 p-1 border border-line rounded-xl',
  tabActive: 'bg-surface text-fg border border-line font-medium rounded-lg shadow-xs',
  tabInactive: 'text-fg-muted hover:text-fg font-medium hover:bg-surface/60 rounded-lg',
  tabSelected: 'bg-brand-soft text-brand border border-brand/25 font-medium rounded-lg',

  // Data Tables
  tableHeader: 'bg-surface-2 text-fg-muted border-b border-line text-xs font-semibold',
  tableHeaderSolid: 'bg-surface-2 border-b border-line text-fg-muted text-xs font-semibold',
  tableRow: 'border-b border-line hover:bg-surface-2/60 transition-colors',
  tableRowSolid: 'border-b border-line hover:bg-surface-2/60 transition-colors',
  tableFooter: 'bg-surface-2 border-t border-line text-fg-muted text-xs font-sans tabular-nums',

  // Modals & Overlays
  modalOverlay: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 dark:bg-black/70',
  modalBox: 'bg-surface border border-line rounded-2xl shadow-xl relative overflow-hidden',
  dropdown: 'bg-surface border border-line rounded-2xl p-5 shadow-lg z-50 text-fg',
  popover: 'bg-surface border border-line rounded-2xl p-2 shadow-lg z-50 text-fg',
  toast: 'fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface border border-line text-fg shadow-lg',

  // Badges
  badgeBrand: 'bg-brand-soft text-brand border border-brand/20 font-medium',
  badgeAdmin: 'bg-brand-soft text-brand border border-brand/25 font-medium',
  badgeTeacher: 'bg-brand-soft text-brand border border-brand/20 font-medium',
  badgeStudent: 'bg-brand-soft text-brand border border-brand/20 font-medium',
  badgeSuccess: 'bg-success-light text-success border border-success/20 font-medium',
  badgeWarning: 'bg-warning-light text-warning border border-warning/25 font-medium',
  badgeError: 'bg-danger-light text-danger border border-danger/20 font-medium',
  badgeInfo: 'bg-brand-soft text-brand border border-brand/20 font-medium',

  // Chat message bubbles
  chatBubbleMe: 'bg-brand text-on-brand rounded-2xl rounded-br-xs',
  chatBubbleThem: 'bg-surface-2 text-fg rounded-2xl rounded-bl-xs border border-line',
} as const;

export type ThemeTokens = typeof themeTokens;

