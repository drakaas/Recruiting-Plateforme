import { Mail, Phone, Facebook, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-foreground text-card py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="font-bold text-sm">JK</span>
              </div>
              <h3 className="font-bold">JobKey</h3>
            </div>
            <p className="text-sm text-card/80">La plateforme de recherche d'emploi made in France</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Candidats</h4>
            <ul className="space-y-2 text-sm text-card/80">
              <li>
                <a href="#" className="hover:text-card transition">
                  Chercher un emploi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-card transition">
                  Mon profil
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-card transition">
                  Mes candidatures
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-card transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Entreprises</h4>
            <ul className="space-y-2 text-sm text-card/80">
              <li>
                <a href="#" className="hover:text-card transition">
                  Recruter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-card transition">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-card transition">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-card transition">
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm text-card/80">
              <li>
                <a href="#" className="hover:text-card transition">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-card transition">
                  CGU
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-card transition">
                  Confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-card transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-card/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-card/80">© 2025 JobKey. Tous droits réservés.</p>

            <div className="flex gap-4">
              <a href="#" className="hover:text-card transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-card transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-card transition">
                <Linkedin size={20} />
              </a>
            </div>

            <div className="flex flex-col gap-2 text-sm text-card/80">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                +33 (0)1 23 45 67 89
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                contact@jobkey.fr
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
