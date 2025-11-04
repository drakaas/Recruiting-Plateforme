"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import successPoolLogo from "../../assets/success-pool-logo.svg"

const primaryLinks = [
  { label: "Offres d'emploi", to: "/jobs", type: "route" },
  { label: "Entreprises", to: "#companies", type: "anchor" },
  { label: "Tarifs", to: "#pricing", type: "anchor" },
  { label: "À propos", to: "#about", type: "anchor" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  return (
  <nav className="sticky top-0 z-50 border-b border-border/60 bg-white/80 shadow-[0_10px_40px_-18px_rgba(15,23,42,0.35)] backdrop-blur-xl supports-backdrop-filter:backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
          <img
            src={successPoolLogo}
            alt="Success Pool logo"
            className="h-10 w-10 rounded-2xl border border-border/40 shadow-sm"
          />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">Success Pool, successful</span>
            <span className="text-xl font-semibold text-foreground">Success Pool</span>
          </div>
        </Link>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-label="Basculer la navigation"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary hover:text-primary md:hidden"
        >
          {isOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
        </button>

        <div
          className={`${
            isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          } absolute left-3 right-3 top-20 origin-top rounded-2xl border border-border/70 bg-white/95 p-6 shadow-2xl transition duration-200 ease-out md:static md:pointer-events-auto md:top-auto md:flex md:h-auto md:w-auto md:translate-x-0 md:items-center md:gap-10 md:border-0 md:bg-transparent md:p-0 md:opacity-100 md:shadow-none`}
        >
          <div className="flex flex-col gap-4 text-base text-muted-foreground md:flex-row md:items-center md:gap-8">
            {primaryLinks.map((item) => {
              const baseClasses = "font-medium transition-colors duration-200 hover:text-primary"
              return item.type === "route" ? (
                <Link key={item.label} to={item.to} className={baseClasses} onClick={closeMenu}>
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.to} className={baseClasses} onClick={closeMenu}>
                  {item.label}
                </a>
              )
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 md:mt-0 md:flex-row md:items-center md:gap-3">
            <button className="rounded-full border border-border/70 px-5 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary">
              Connexion
            </button>
            <button className="rounded-full bg-linear-to-r from-primary to-accent px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:shadow-md">
              S'inscrire
            </button>
            <a
              href="#recruiter"
              className="rounded-full bg-secondary/60 px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary hover:text-foreground/90"
            >
              Espace Recruteur
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
