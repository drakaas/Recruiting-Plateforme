import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import StatsSection from "@/components/stats-section"
import JobListings from "@/components/job-listings"
import PartnerCompanies from "@/components/partner-companies"
import WhyUsSection from "@/components/why-us-section"
import PricingPlans from "@/components/pricing-plans"
import TestimonialsSection from "@/components/testimonials-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <JobListings />
      <PartnerCompanies />
      <WhyUsSection />
      <PricingPlans />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}
