import HeroSection from './components/hero-section'
import StatsSection from './components/stats-section'
import JobListings from './components/job-listings'
import PartnerCompanies from './components/partner-companies'
import WhyUsSection from './components/why-us'
import PricingPlans from './components/pricing-plans'
import TestimonialsSection from './components/testimonials-section'
import Footer from './components/footer'
import { useAccueil } from './useAccueil'

export default function AccueilPage() {
  const { heroTags, stats, jobs, companies, features, plans, testimonials } = useAccueil()

  return (
    <main className="min-h-screen bg-background">
      <HeroSection tags={heroTags} />
      <StatsSection stats={stats} />
      <JobListings jobs={jobs} />
      <PartnerCompanies companies={companies} />
      <WhyUsSection features={features} />
      <PricingPlans plans={plans} />
      <TestimonialsSection testimonials={testimonials} />
      <Footer />
    </main>
  )
}


