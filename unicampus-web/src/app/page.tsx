"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import ProductHero from "@/components/landing/ProductHero";
import PersonaShowcase from "@/components/landing/PersonaShowcase";
import CampusMetrics from "@/components/landing/CampusMetrics";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { MobileTeaser } from "@/components/landing/MobileTeaser";
import { LandingFAQ } from "@/components/landing/LandingFAQ";
import LandingFooter from "@/components/landing/LandingFooter";
import { DemoModal } from "@/components/landing/DemoModal";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { ACTIVE_TERM } from "@/lib/canonicalCampus";

export default function LandingPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-clip bg-canvas text-fg transition-colors selection:bg-brand selection:text-on-brand relative">
      {/* =========================================================================
          TOP NAVIGATION HEADER
      ========================================================================= */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-surface/85 border-b border-line transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-on-brand shadow-2xs group-hover:scale-105 transition-transform font-bold text-sm">
              U
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base text-fg tracking-tight leading-none">
                UniCampus
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-fg-muted">
            <a href="#features" className="hover:text-fg transition-colors">
              Features
            </a>
            <a href="#portals" className="hover:text-fg transition-colors">
              For students
            </a>
            <a href="#portals" className="hover:text-fg transition-colors">
              For faculty
            </a>
            <a href="#portals" className="hover:text-fg transition-colors">
              For admins
            </a>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <ThemeToggle />

            <Link href="/login" className="hidden sm:inline-block">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>

            <div className="hidden sm:inline-flex">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsDemoModalOpen(true)}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Try the demo
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-surface-2 border border-line flex items-center justify-center text-fg cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-line bg-surface px-4 py-4 space-y-1">
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center min-h-[44px] py-2 text-sm font-medium text-fg"
            >
              Features
            </a>
            <a
              href="#portals"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center min-h-[44px] py-2 text-sm font-medium text-fg"
            >
              Portals Overview
            </a>
            <div className="pt-2 border-t border-line flex flex-col gap-2">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="secondary" size="md" fullWidth>
                  Sign in
                </Button>
              </Link>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsDemoModalOpen(true);
                }}
              >
                Try the demo
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          HERO SECTION
      ========================================================================= */}
      <ProductHero onOpenDemoModal={() => setIsDemoModalOpen(true)} />

      {/* =========================================================================
          INSTITUTIONAL NUMBERS (PLAIN, NO BOXES)
      ========================================================================= */}
      <CampusMetrics />

      {/* =========================================================================
          3-PERSONA CAPABILITY SHOWCASE
      ========================================================================= */}
      <PersonaShowcase onOpenDemoModal={() => setIsDemoModalOpen(true)} />

      {/* =========================================================================
          CORE FEATURES GRID
      ========================================================================= */}
      <FeaturesGrid />

      {/* =========================================================================
          MOBILE APP COMPANION TEASER
      ========================================================================= */}
      <MobileTeaser />

      {/* =========================================================================
          FREQUENTLY ASKED QUESTIONS
      ========================================================================= */}
      <LandingFAQ />

      {/* =========================================================================
          PRE-FOOTER CALL TO ACTION
      ========================================================================= */}
      <section className="py-20 md:py-24 text-center border-t border-line bg-gradient-to-b from-surface via-surface to-brand-soft/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <span className="text-xs font-semibold text-brand">Portal Access</span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
            Get started with UniCampus
          </h2>
          <p className="text-sm sm:text-base text-fg-muted max-w-xl mx-auto">
            Explore student, faculty, and administrative workflows or request an institutional account for {ACTIVE_TERM}.
          </p>
          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Request account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER (4-COLUMN)
      ========================================================================= */}
      <LandingFooter />

      {/* =========================================================================
          DEMO ROLE SELECTOR MODAL
      ========================================================================= */}
      <DemoModal
        open={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </div>
  );
}
