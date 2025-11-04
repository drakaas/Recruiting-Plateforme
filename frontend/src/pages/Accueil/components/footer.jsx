import { Mail, Phone, Facebook, Twitter, Linkedin } from "lucide-react"
import successPoolLogo from "../../../assets/success-pool-logo.svg"

const footerLinks = [
  {
    title: "Candidats",
    items: [
      { label: "Chercher un emploi", href: "#" },
      { label: "Mon profil", href: "#" },
      { label: "Mes candidatures", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Entreprises",
    items: [
      { label: "Recruter", href: "#" },
      { label: "Tarifs", href: "#pricing" },
      { label: "Support", href: "#" },
      { label: "API", href: "#" },
    ],
  },
  {
    title: "Légal",
    items: [
      { label: "À propos", href: "#about" },
      { label: "CGU", href: "#" },
      { label: "Confidentialité", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative mt-24 bg-linear-to-b from-foreground via-foreground to-foreground/95 py-16 text-card">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--accent)/25,transparent_60%)]" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <img
                src={successPoolLogo}
                alt="Success Pool logo"
                className="h-10 w-10 rounded-2xl border border-card/20 shadow-sm"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-card/60">Success Pool, successful</p>
                <h3 className="text-xl font-semibold">Success Pool</h3>
              </div>
            </div>
            <p className="mt-6 text-sm text-card/80">
              L'écosystème Success Pool rapproche talents et entreprises ambitieuses grâce à une synergie d'accompagnement humain et d'outils intelligents.
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-card/80">
              <span className="inline-flex items-center gap-2">
                <Phone size={16} /> +33 (0)1 23 45 67 89
              </span>
              <span className="inline-flex items-center gap-2">
                <Mail size={16} /> contact@successpool.com
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h4 className="text-sm font-semibold uppercase tracking-[0.24em] text-card/70">{column.title}</h4>
                <ul className="mt-5 space-y-3 text-sm text-card/80">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className="transition hover:text-card">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-card/20 pt-6 text-sm text-card/70 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Success Pool. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-card/70">
            <a href="#" className="transition hover:text-card">
              <Facebook size={20} />
            </a>
            <a href="#" className="transition hover:text-card">
              <Twitter size={20} />
            </a>
            <a href="#" className="transition hover:text-card">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
