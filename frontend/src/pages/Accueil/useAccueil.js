import { CheckCircle, Zap, Users, Trophy } from 'lucide-react'

export function useAccueil() {
  const heroTags = ['Télétravail', 'CDI', 'PME', 'Startup']

  const stats = [
    { label: "Offres d'emploi", value: '12,500+' },
    { label: 'Entreprises partenaires', value: '2,800+' },
    { label: 'Candidats placés', value: '45,000+' },
    { label: 'Satisfaction', value: '98%' },
  ]

  const jobs = [
    {
      id: 1,
      title: 'Designer UX/UI Senior',
      company: 'TechFlow',
      location: 'Paris, France',
      type: 'CDI',
      salary: '50-65k',
      tags: ['Design', 'Figma', 'User Research'],
      logo: 'TF',
      featured: true,
    },
    {
      id: 2,
      title: 'Développeur Full Stack',
      company: 'StartupX',
      location: 'Télétravail',
      type: 'CDI',
      salary: '45-60k',
      tags: ['React', 'Node.js', 'PostgreSQL'],
      logo: 'SX',
      featured: true,
    },
    {
      id: 3,
      title: 'Product Manager',
      company: 'DataCore',
      location: 'Lyon, France',
      type: 'CDI',
      salary: '48-62k',
      tags: ['Product', 'Analytics', 'Leadership'],
      logo: 'DC',
      featured: false,
    },
    {
      id: 4,
      title: 'Développeur Backend Python',
      company: 'CloudSync',
      location: 'Toulouse, France',
      type: 'CDI',
      salary: '42-55k',
      tags: ['Python', 'AWS', 'Docker'],
      logo: 'CS',
      featured: false,
    },
  ]

  const companies = [
    { name: 'TechFlow', initials: 'TF', color: 'bg-sky-500' },
    { name: 'StartupX', initials: 'SX', color: 'bg-cyan-500' },
    { name: 'DataCore', initials: 'DC', color: 'bg-teal-500' },
    { name: 'CloudSync', initials: 'CS', color: 'bg-indigo-500' },
    { name: 'WebMaster', initials: 'WM', color: 'bg-blue-500' },
    { name: 'InnovateLabs', initials: 'IL', color: 'bg-emerald-500' },
  ]

  const features = [
    {
      icon: CheckCircle,
      title: 'Offres vérifiées',
      description: 'Toutes nos offres sont validées et à jour pour vous garantir les meilleurs opportunités',
    },
    {
      icon: Zap,
      title: 'Matching intelligent',
      description: "Notre algorithme vous propose les offres qui correspondent le mieux à votre profil",
    },
    {
      icon: Users,
      title: 'Accompagnement',
      description: "Des experts vous conseillent tout au long de votre recherche d'emploi",
    },
    {
      icon: Trophy,
      title: 'Taux de succès',
      description: '98% de nos candidats trouvent un emploi dans les 3 mois',
    },
  ]

  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      description: 'Pour débuter votre recherche',
      features: [
        "Accès aux offres d'emploi",
        'Jusqu\'à 3 candidatures par mois',
        'Profil basique',
        'Alertes emploi simples',
      ],
      cta: 'Commencer',
      highlighted: false,
    },
    {
      name: 'Premium',
      price: '9,99€',
      period: '/mois',
      description: 'Pour une recherche optimale',
      features: [
        'Accès illimité aux offres',
        'Candidatures illimitées',
        'Profil avancé avec CV',
        'Alertes personnalisées',
        'Support prioritaire',
        'Feedback sur vos candidatures',
      ],
      cta: 'Essayer gratuitement',
      highlighted: true,
    },
    {
      name: 'Entreprise',
      price: 'Sur devis',
      description: 'Pour recruter les meilleurs talents',
      features: [
        'Postez vos offres',
        'Accès à la base de candidats',
        'Messaging illimité',
        'Analytics avancées',
        'Manager dédié',
        'Intégrations API',
      ],
      cta: 'Contacter',
      highlighted: false,
    },
  ]

  const testimonials = [
    {
      name: 'Sophie Martin',
      role: 'Designer UX',
      company: 'TechFlow',
  text: "Success Pool a complètement changé ma recherche d'emploi. J'ai trouvé mon poste de rêve en 2 semaines!",
      rating: 5,
      avatar: 'SM',
    },
    {
      name: 'Pierre Dupont',
      role: 'Développeur Full Stack',
      company: 'StartupX',
  text: "La plateforme Success Pool est intuitive et l'accompagnement a été excellent. Je recommande vivement!",
      rating: 5,
      avatar: 'PD',
    },
    {
      name: 'Marie Lefevre',
      role: 'Product Manager',
      company: 'DataCore',
      text: 'Les offres proposées correspondaient vraiment à mon profil. Un gain de temps énorme!',
      rating: 5,
      avatar: 'ML',
    },
  ]

  return { heroTags: heroTags, stats, jobs, companies, features, plans, testimonials }
}


