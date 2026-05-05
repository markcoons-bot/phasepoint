'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

const appLinks = [
  { href: '/demo',       label: 'Patient Portal'  },
  { href: '/clinician',  label: 'Clinician OS'    },
  { href: '/calculator', label: 'RTM Calculator'  },
  { href: '/research',   label: 'Research Case'   },
]

export default function Navigation() {
  const pathname = usePathname()
  const isLanding = pathname === '/'
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    if (!isLanding) return
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isLanding])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // ── Landing page nav ──────────────────────────────────────────────────────
  if (isLanding) {
    return (
      <nav
        className={[
          'fixed top-0 left-0 right-0 z-50 px-5 md:px-8 py-4 md:py-5',
          'flex items-center justify-between',
          'transition-all duration-300',
          scrolled
            ? 'bg-forest-900/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.06)]'
            : 'bg-transparent',
        ].join(' ')}
      >
        <Link
          href="/"
          className={[
            'font-display text-xl tracking-[0.2em] uppercase select-none transition-colors duration-300',
            scrolled ? 'text-cream-50' : 'text-forest-900',
          ].join(' ')}
        >
          Phasepoint
        </Link>

        <Link
          href="/demo"
          className={[
            'text-xs md:text-sm font-body font-medium px-4 md:px-5 py-2 md:py-2.5 rounded-lg transition-all duration-300',
            scrolled
              ? 'border border-sage-300/30 text-sage-200 hover:bg-sage-200/10'
              : 'bg-forest-900 text-cream-25 hover:bg-forest-800',
          ].join(' ')}
        >
          <span className="hidden sm:inline">Enter Clinical Demo →</span>
          <span className="sm:hidden">Demo →</span>
        </Link>
      </nav>
    )
  }

  // ── Application nav ───────────────────────────────────────────────────────
  return (
    <div className="bg-forest-900 sticky top-0 z-50 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-14 flex items-center gap-4 md:gap-8">

        {/* Wordmark + badge */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <Link
            href="/"
            className="font-display text-lg tracking-[0.2em] text-cream-50 uppercase select-none hover:text-cream-200 transition-colors"
          >
            Phasepoint
          </Link>
          <span className="hidden sm:inline text-[10px] font-body font-medium px-2 py-0.5 rounded-full bg-sage-200/15 text-sage-200 tracking-wide uppercase">
            Clinical Demo
          </span>
        </div>

        {/* Desktop center nav links */}
        <div className="hidden md:flex items-center gap-1 mx-auto">
          {appLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'relative px-3.5 py-1.5 text-sm font-body rounded-md transition-colors',
                  active
                    ? 'text-sage-300'
                    : 'text-sage-100/60 hover:text-sage-200 hover:bg-sage-200/6',
                ].join(' ')}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[1.5px] rounded-full bg-sage-300" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Desktop clinician identity */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0 ml-auto">
          <div className="w-7 h-7 rounded-full bg-forest-700 border border-sage-300/20 flex items-center justify-center">
            <span className="text-[10px] font-body font-semibold text-sage-200 tracking-wide">BW</span>
          </div>
          <span className="text-sm font-body text-sage-200/80">Dr. Weedman</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto p-2 -mr-1 rounded-md text-sage-200/80 hover:text-sage-200 hover:bg-sage-200/10 transition-colors"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 5h14a1 1 0 000-2H3a1 1 0 000 2zm0 6h14a1 1 0 000-2H3a1 1 0 000 2zm0 6h14a1 1 0 000-2H3a1 1 0 000 2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden overflow-hidden border-t border-cream-50/10"
          >
            <div className="px-4 py-3 space-y-1 bg-forest-900">
              {appLinks.map(({ href, label }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    className={[
                      'block px-3.5 py-2.5 rounded-lg font-body text-sm transition-colors',
                      active
                        ? 'bg-sage-200/12 text-sage-300'
                        : 'text-sage-100/70 hover:bg-sage-200/8 hover:text-sage-200',
                    ].join(' ')}
                  >
                    {label}
                  </Link>
                )
              })}
              <div className="pt-2 mt-2 border-t border-cream-50/10 px-3.5 py-2 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-forest-700 border border-sage-300/20 flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-body font-semibold text-sage-200">BW</span>
                </div>
                <span className="text-xs font-body text-sage-200/60">Dr. Weedman</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
