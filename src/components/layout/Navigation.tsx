'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const appLinks = [
  { href: '/demo',       label: 'Patient Portal' },
  { href: '/clinician',  label: 'Clinician OS' },
  { href: '/calculator', label: 'RTM Calculator' },
  { href: '/research',   label: 'Research Case' },
]

export default function Navigation() {
  const pathname = usePathname()
  const isLanding = pathname === '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!isLanding) return
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isLanding])

  // ── Landing page nav ──────────────────────────────────────────────────────
  if (isLanding) {
    return (
      <nav
        className={[
          'fixed top-0 left-0 right-0 z-50 px-8 py-5',
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
            'text-sm font-body font-medium px-5 py-2.5 rounded-lg transition-all duration-300',
            scrolled
              ? 'border border-sage-300/30 text-sage-200 hover:bg-sage-200/10'
              : 'bg-forest-900 text-cream-25 hover:bg-forest-800',
          ].join(' ')}
        >
          Enter Clinical Demo →
        </Link>
      </nav>
    )
  }

  // ── Application nav ───────────────────────────────────────────────────────
  return (
    <nav className="bg-forest-900 w-full sticky top-0 z-50 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <div className="max-w-[1440px] mx-auto px-8 py-0 h-14 flex items-center gap-8">

        {/* Wordmark + badge */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="font-display text-lg tracking-[0.2em] text-cream-50 uppercase select-none hover:text-cream-200 transition-colors"
          >
            Phasepoint
          </Link>
          <span className="text-[10px] font-body font-medium px-2 py-0.5 rounded-full bg-sage-200/15 text-sage-200 tracking-wide uppercase">
            Clinical Demo
          </span>
        </div>

        {/* Center nav links */}
        <div className="flex items-center gap-1 mx-auto">
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

        {/* Clinician identity */}
        <div className="flex items-center gap-2.5 shrink-0 ml-auto">
          <div className="w-7 h-7 rounded-full bg-forest-700 border border-sage-300/20 flex items-center justify-center">
            <span className="text-[10px] font-body font-semibold text-sage-200 tracking-wide">BW</span>
          </div>
          <span className="text-sm font-body text-sage-200/80">Dr. Weedman</span>
        </div>
      </div>
    </nav>
  )
}
