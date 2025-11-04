"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">JK</span>
            </div>
            <h1 className="text-xl font-bold text-foreground hidden sm:block">JobKey</h1>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div
            className={`${isOpen ? "block" : "hidden"} md:block absolute md:static top-16 left-0 right-0 md:top-auto bg-white md:bg-transparent border-b md:border-b-0 border-border p-4 md:p-0`}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <a href="#jobs" className="text-foreground hover:text-primary transition">
                Offres d'emploi
              </a>
              <a href="#companies" className="text-foreground hover:text-primary transition">
                Entreprises
              </a>
              <a href="#pricing" className="text-foreground hover:text-primary transition">
                Tarifs
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition">
                À propos
              </a>
            </div>
          </div>

          <div
            className={`${isOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-3 absolute md:static bottom-0 left-0 right-0 md:bottom-auto p-4 md:p-0 bg-white md:bg-transparent border-t md:border-t-0 border-border`}
          >
            <button className="px-4 py-2 text-primary font-medium hover:bg-secondary rounded-lg transition w-full md:w-auto text-center">
              Connexion
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-opacity-90 transition w-full md:w-auto">
              S'inscrire
            </button>
            <a
              href="#recruiter"
              className="px-4 py-2 border border-accent text-accent font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition w-full md:w-auto text-center"
            >
              Espace Recruteur
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
